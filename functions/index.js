const functions = require('firebase-functions')
const emailjs = require('emailjs')

const NIKO_EMAIL = 'niko@niko.rocks'
const TEST_EMAIL = 'niko+tests@niko.rocks'
const smtpAgentEmail = functions.config().smtp.user
const to = functions.config().smtp.to || NIKO_EMAIL // fallback to me if to address not configured

const originWhitelist = [
  'https://www.jessicalchang.com',
  'http://www.jessicalchang.com',
  'https://jessicalchang.com',
  'http://jessicalchang.com',
]

function sendMail(req, res) {
  const {fromEmail, firstName, lastName, message, subject} = req.body

  console.info('POST payload:', req.body)

  const text = `First name: ${firstName}\nLast name: ${lastName}\nEmail: ${fromEmail}\n\nSubject: ${subject}\n\n${message}`

  return new Promise(() => {
    let hadOkResponse = false // smtp.send is weird and calls callback twice. Once for successful message sent, in which case we should set this flag to true, and again ~1 second later with an error once stmp connection had already been disconnected. Don't log the error in this case since message was successful
    const smtp = emailjs.server.connect({
      user: smtpAgentEmail,
      password: functions.config().smtp.pass,
      host: functions.config().smtp.host,
      port: parseInt(functions.config().smtp.port),
      tls: functions.config().smtp.tls === 'true',
    })

    const smtpPayload = {
      sender: smtpAgentEmail,
      'return-path': smtpAgentEmail,
      from: fromEmail,
      'reply-to': fromEmail,
      to: req.isSmtpTest ? TEST_EMAIL : to,
      subject: `Message from ${firstName} ${lastName} - ${subject}`,
      text,
    }

    // bcc me as well if not a test
    if (!req.isSmtpTest) {
      smtpPayload.bcc = NIKO_EMAIL
    }

    smtp.send(smtpPayload, (error, message) => {
      if (error && hadOkResponse) {
        console.warn('Received error after 200 response was sent (should be safe to ignore)', error)
      } else if (error) {
        if (req.isSmtpTest) {
          console.error('Failed Smtp test! error:', error)
        } else {
          console.error({error})
        }
        res.status(500).send({error})
      } else {
        if (req.isSmtpTest) {
          console.info('Successful Smtp test! Response:', message)
        } else {
          console.info('Success!', message)
        }
        hadOkResponse = true
        res.status(200).send({success: true})
      }
    })
  })
}

function testSmtp(req, res) {
  // Unfortunately can't hit endpoint to test e2e as free firebase doesn't allow external network requests outside of google services (apparently they don't consider firebase a google service...)

  console.info('Testing smtp')

  const json = {
    firstName: 'Smtp',
    lastName: 'Test',
    fromEmail: 'testsmtp@yahoo.com',
    subject: 'Smtp Test',
    message: 'This is an Smtp Test request.'
  }

  req.body = json
  req.isSmtpTest = true

  return sendMail(req, res)
}

exports.sendMail = functions.https.onRequest((req, res) => {
  const origin = req.headers['origin'] || req.headers['Origin']
  console.info(`Received ${req.method} request from ${req.ip}, origin: ${origin}`)

  const isOriginWhitelisted = originWhitelist.indexOf(origin) >= 0
  res.header('Access-Control-Allow-Origin', isOriginWhitelisted ? origin : originWhitelist[0])
  res.header('Access-Control-Allow-Methods', 'POST,OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type,Accept')

  if (req.method === 'OPTIONS') {
    res.status(200).send()
  } else if (req.method !== 'POST') {
    res.status(404).send({error: 'Not found'})
  } else if (!req.is('application/json')) {
    res.status(500).send({error: 'Unexpected content type'})
  } else {
    return sendMail(req, res)
      .catch((error) => {
        console.error({error})
        res.status(500).send({error})
      })
  }
})

exports.testSmtp = functions.https.onRequest((req, res) => {
  console.info(`Received ${req.method} request from ${req.ip}`)

  res.header('Access-Control-Allow-Origin', 'https://www.jessicalchang.com')
  res.header('Access-Control-Allow-Methods', 'GET')
  res.header('Access-Control-Allow-Headers', 'Content-Type,Accept')

  if (req.method !== 'GET') {
    res.status(404).send({error: 'Not found'})
  } else {
    return testSmtp(req, res)
  }
})
