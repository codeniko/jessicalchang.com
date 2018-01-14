// feature support / polyfills
function browserSupportsAllFeatures() {
  return window.Promise && window.fetch && [].map && [].some
}

function loadScript(src, done) {
  var js = document.createElement('script')
  js.src = src
  js.onload = function() { done() }
  js.onerror = function() {
    done(new Error('Failed to load script ' + src))
  }
  document.head.appendChild(js)
}

// Fetch helpers
function checkStatus(response) {
  if (response.ok) {
    return response
  } else {
    var error = new Error(response.statusText)
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
$('#page-overlay').click(function() {
  var isNavMenuOpen = $('#nav-trigger').is(':checked')

  if (isNavMenuOpen) {
    closeMobileNavMenu()
  }
})

// close mobile navmenu and page overlay if nav menu open
$('#navmenu-close-icon').click(function() {
  var isNavMenuOpen = $('#nav-trigger').is(':checked')

  if (isNavMenuOpen) {
    closeMobileNavMenu()
  }
})

// When nav menu for mobile opened, show page overlay and lock scrolling
$('#nav-trigger').click(function() {
  var isNavMenuOpen = $('#nav-trigger').is(':checked')

  // should be triggered because element is input, but check incase anything weird happens where input isn't checked
  if (isNavMenuOpen) {
    showPageOverlay()
    window.scrollTo(0, 0)
  }
})


// Contact modal
var formIDs = [
  '#first-name',
  '#last-name',
  '#subject',
  '#message',
  '#email'
]

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
  /*
  if (isValid)
    $(id + '-label').removeClass('error-color')
  else
    $(id + '-label').addClass('error-color')
    */
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

$('#contact-submit-button').click(function() {
  validateContactForm()
})

// end of contact modal


$('#work-nav-link').click(function() {
  closeMobileNavMenu()
})

if (Typed) {
  var typed = new Typed('.typed-text', {
    strings: [
      "a creator.",
      "a designer.",
      "a problem-solver.",
      "an adventurer."
    ],
    typeSpeed: 70,
    backSpeed: 50,
    startDelay: 0,
    backDelay: 1500,
    smartBackspace: true,
    loop:true,
    showCursor: false,
    autoInsertCss: true,
  })
}


function highlightWorksNavLink() {
  worksNavLinkHighlighted = true
  $('.home-nav-link').removeClass('nav-current')
  $('#work-nav-link').addClass('nav-current')
}
function highlightHomeNavLink() {
  worksNavLinkHighlighted = false
  $('.home-nav-link').addClass('nav-current')
  $('#work-nav-link').removeClass('nav-current')
}

var path = window.location.pathname
var worksNavLinkHighlighted = false
if (path === '/') {
  var worksPos = $('#featured-work')[0].scrollHeight

  // home nav link is highlighted by default
  // handle if page refreshed and is already prescrolled to works section
  if (document.scrollingElement.scrollTop >= worksPos)
    highlightWorksNavLink()

  $(document).scroll(function() {
    if (document.scrollingElement.scrollTop >= worksPos && !worksNavLinkHighlighted)
      highlightWorksNavLink()
    else if (document.scrollingElement.scrollTop < worksPos && worksNavLinkHighlighted)
      highlightHomeNavLink()
  })
}

// polyfill if on older browser that doesn't support necessary features
if (!browserSupportsAllFeatures()) {
  loadScript('https://cdn.polyfill.io/v2/polyfill.min.js?features=Promise,fetch,Array.prototype.map,Array.prototype.some', metrics)
}
