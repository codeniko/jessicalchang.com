var formIDs = [
  '#first-name',
  '#last-name',
  '#subject',
  '#message',
  '#email'
]

function sendEmail() {
  var endpoint = 'https://us-central1-jessica-portfolio.cloudfunctions.net/sendMail'
  var reqOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      firstName: $('#first-name').val(),
      lastName: $('#last-name').val(),
      fromEmail: $('#email').val(),
      subject: $('#subject').val(),
      message: $('#message').val()
    })
  }

  fetch(endpoint, reqOptions)
    .then(checkStatus)
    .then(parseJson)
    .then(function(response) {
      console.info('response', response)
      hideContactSpinner()

      if (response.error) {
        console.error('Received error on server side', response.error)
        alert('Sorry, we were unable to send the message at this time. Please try again!')
      } else {
        resetContactForm()
        $('#contact-form').css('display', 'none')
        $('#contact-form-success').css('display', 'inline-block')
      }
    })
    .catch(function(e) {
      console.error('Received error', e)
      hideContactSpinner()
      alert('Sorry, we were unable to send the message at this time. Please try again!')
    })
}

function showContactSpinner() {
  $('#contact-submit-button-text').css('display', 'none')
  $('#contact-spinner').css('display', 'block')
}

function hideContactSpinner() {
  $('#contact-spinner').css('display', 'none')
  $('#contact-submit-button-text').css('display', 'inline-block')
}

function resetContactForm() {
  $('#contact-form')[0].reset() // clear form
  // reset error labels and error colors in form
  formIDs.forEach(function(id) {
    $(id + '-error').css('display', 'none')
    //$(id + '-label').removeClass('error-color')
  })
}

function validateFormInput(id) {
  var value = $(id).val()
  var isValid = id === '#email' ? value.match(/^.+\@.+\..+$/) : value !== ''
  $(id + '-error').css('display', isValid ? 'none' : 'block')
  return isValid
}

function validateContactForm() {
  var hasError = formIDs.map(validateFormInput).some(function(r) { return !r })

  console.debug('error in form?', hasError)

  if (!hasError) {
    showContactSpinner()
    sendEmail()
  }
}


// hooks
$('#contact-submit-button').click(function() {
  validateContactForm()
})
