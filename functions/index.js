const functions = require('firebase-functions')
const emailjs = require('emailjs')

const from = functions.config().smtp.user
const to = functions.config().smtp.to || 'niko@niko.rocks' // fallback to me if to address not configured

function sendMail(req, res) {
  const {fromEmail, firstName, lastName, message, subject} = req.body

  console.info('POST payload:', req.body)

  const text = `First name: ${firstName}\nLast name: ${lastName}\nEmail: ${fromEmail}\n\nSubject: ${subject}\n\n${message}`

  return new Promise(() => {
    const smtp = emailjs.server.connect({
      user: from,
      password: functions.config().smtp.pass,
      host: functions.config().smtp.host,
      port: parseInt(functions.config().smtp.port),
      tls: functions.config().smtp.tls === 'true',
    })

    smtp.send({
      text,
      from,
      to,
      subject: `Portfolio message from ${firstName} ${lastName} - ${subject}`,
    }, (error, message) => {
      if (error) {
        console.error({error})
        res.status(500).send({error})
      } else {
        console.info('Success!', message)
        res.status(200).send({success: true})
      }
    })
  })
}

exports.sendMail = functions.https.onRequest((req, res) => {
  console.info(`Received ${req.method} request from ${req.ip}`)

  res.header('Access-Control-Allow-Origin', 'http://www.jessicalchang.com')
  res.header('Access-Control-Allow-Methods', 'POST,OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type,Accept')

  if (req.method === 'OPTIONS') {
    res.status(200).send()
  }else if (req.method !== 'POST') {
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
