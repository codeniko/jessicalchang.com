// hide page overlay and unlock scrolling
$('#page-overlay').click(() => {
  const isOpen = $('#nav-trigger').is(':checked')

  if (isOpen) {
    $('#page-overlay').css('display', 'none')
    $('#nav-trigger').prop('checked', false)
    $('body').css('overflow-y', 'scroll')
  }
})

// When nav menu for mobile opened, show page overlay and lock scrolling
$('#nav-trigger').click(() => {
  const isOpen = $('#nav-trigger').is(':checked')

  // should be triggered because element is input, but check incase anything weird happens where input isn't checked
  if (isOpen) {
    $('#page-overlay').css('display', 'block')
    $('body').css('overflow-y', 'hidden')
    window.scrollTo(0, 0);
  }
})
