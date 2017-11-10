
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

function sendEmail(mailObj) {
  return Email.send(
    "nikotestingabc@yahoo.com",
    "niko@niko.rocks",
    "This is a subject",
    "this is the body",
    {
      token: 'b1d95a12-4005-43bc-b19a-cbdcb87e6da3',
      callback: (result) => {
        console.log('result:', result)
      }
    })
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
  closeContactModal()
})

// end of contact modal


$('#work-nav-link').click(() => {
  closeMobileNavMenu()
})
