var path = window.location.pathname
var worksNavLinkHighlighted = false

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
  $('#nav-trigger')[0].checked = false
}

// Hooks

// close mobile navmenu, and page overlay
$('#page-overlay').click(function() {
  var isNavMenuOpen = $('#nav-trigger')[0].checked

  if (isNavMenuOpen) {
    closeMobileNavMenu()
  }
})

// close mobile navmenu and page overlay if nav menu open
$('#navmenu-close-icon').click(function() {
  var isNavMenuOpen = $('#nav-trigger')[0].checked

  if (isNavMenuOpen) {
    closeMobileNavMenu()
  }
})

// When nav menu for mobile opened, show page overlay and lock scrolling
$('#nav-trigger').click(function() {
  var isNavMenuOpen = $('#nav-trigger')[0].checked

  // should be triggered because element is input, but check incase anything weird happens where input isn't checked
  if (isNavMenuOpen) {
    showPageOverlay()
    window.scrollTo(0, 0)
  }
})

$('#work-nav-link').click(function() {
  closeMobileNavMenu()
})

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

// polyfill if on older browser that doesn't support necessary features
if (!browserSupportsAllFeatures()) {
  loadScript('https://cdn.polyfill.io/v2/polyfill.min.js?features=Promise,fetch,Array.prototype.map,Array.prototype.some', metrics)
}
