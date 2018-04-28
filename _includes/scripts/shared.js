var path = window.location.pathname
var worksNavLinkHighlighted = false
init()

// feature support / polyfills
function browserSupportsAllFeatures() {
  return window.Promise && window.fetch && [].map && [].some && [].forEach && Object.keys
}

function loadScript(src, done) {
  var js = document.createElement('script')
  js.src = src
  if (done) {
    js.onload = function() { done() }
    js.onerror = function() {
      done(new Error('Failed to load script ' + src))
    }
  }
  document.head.appendChild(js)
}

// check if google analytics loaded, otherwise attempt fetch again and possibly log pageview through api
function scheduleRefetchGtagIfNeeded() {
  setTimeout(function() {
    if (!window.ga) {
      log.info('ga not loaded')
      window.gaUtils.refetchGtagOrLogThroughServer()
    }
  }, 1000)
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

function init() {
  // polyfill if client has older browser that doesn't support necessary features
  if (!browserSupportsAllFeatures()) {
    log.info('Fetching polyfills')
    i13n.timerStart('fetch-polyfills')
    loadScript('https://cdn.polyfill.io/v2/polyfill.min.js?features=Promise,fetch,Array.prototype.map,Array.prototype.some,Array.prototype.forEach,Object.keys', function(e) {
      i13n.timerStop('fetch-polyfills')
      if (e) {
        log.error('Error loading polyfills.', e)
      }
      scheduleRefetchGtagIfNeeded()
    })
  } else {
    scheduleRefetchGtagIfNeeded()
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

  $('#resume-button', true).click(function() {
    i13n.logEvent('view_resume')
  })
}
