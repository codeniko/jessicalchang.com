// Fetch helpers
function checkStatus(response) {
  if (response.ok) {
    return response
  } else {
    const error = new Error(response.statusText)
    error.response = response
    error.status = response.status
    throw error
  }
}

function parseJson(response) {
  return response.json()
}

function parseText(response) {
  return response.text()
}
// End of fetch helpers


function sendEmail() {
  const endpoint = 'https://us-central1-jessica-portfolio.cloudfunctions.net/sendMail'
  const reqOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      firstName: $('#first-name').val(),
      lastName: $('#last-name').val(),
      fromEmail: $('#email').val(),
      subject: $('#subject').val(),
      message: $('#message').val(),
    }),
  }

  fetch(endpoint, reqOptions)
    .then(checkStatus)
    .then(parseJson)
    .then(response => {
      console.info('response', response)
      if (response.error) {
        console.error('Received error on server side', response.error)
        alert('Sorry, we were unable to send the message at this time. Please try again!')
      } else {
        closeContactModal()
      }
    })
    .catch(e => {
      console.error('Received error', e)
      alert('Sorry, we were unable to send the message at this time. Please try again!')
    })
}

// hide page overlay and unlock scrolling
function hidePageOverlay() {
  $('#page-overlay').css('display', 'none')
  $('body').css('overflow-y', 'scroll')
}

function showPageOverlay() {
  $('#page-overlay').css('display', 'block')
  $('body').css('overflow-y', 'hidden')
}

function closeMobileNavMenu() {
  hidePageOverlay()
  $('#nav-trigger').prop('checked', false)
}

// Hooks into HTML elements

// close mobile navmenu, contact form, and page overlay
$('#page-overlay').click(() => {
  const isNavMenuOpen = $('#nav-trigger').is(':checked')

  if (isNavMenuOpen) {
    closeMobileNavMenu()
  }
  closeContactModal()
})

// close mobile navmenu and page overlay if nav menu open
$('#navmenu-close-icon').click(() => {
  const isNavMenuOpen = $('#nav-trigger').is(':checked')

  if (isNavMenuOpen) {
    closeMobileNavMenu()
  }
})

// When nav menu for mobile opened, show page overlay and lock scrolling
$('#nav-trigger').click(() => {
  const isNavMenuOpen = $('#nav-trigger').is(':checked')

  // should be triggered because element is input, but check incase anything weird happens where input isn't checked
  if (isNavMenuOpen) {
    showPageOverlay()
    window.scrollTo(0, 0);
  }
})


// Contact modal
function showContactModal() {
  $('#contact-modal').css('display', 'flex')
  showPageOverlay()
}

function closeContactModal() {
  $('#contact-modal').css('display', 'none')
  $('#contact-form')[0].reset() // clear form
  hidePageOverlay()
}

$('#contact-nav-link').click(() => {
  closeMobileNavMenu()
  showContactModal()
})
$('#contact-close-icon').click(() => {
  closeContactModal()
})
$('#contact-close-icon-2').click(() => {
  closeContactModal()
})
$('#contact-submit-button').click(() => {
  sendEmail()
})

// end of contact modal


$('#work-nav-link').click(() => {
  closeMobileNavMenu()
})
