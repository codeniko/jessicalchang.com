// hero header
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

var worksPos = $('#featured-work')[0].scrollHeight

// home nav link is highlighted by default
// handle if page refreshed and is already prescrolled to works section
if (document.scrollingElement && document.scrollingElement.scrollTop >= worksPos)
  highlightWorksNavLink()


// Hooks
document.onscroll = function() {
  if (document.scrollingElement && document.scrollingElement.scrollTop >= worksPos && !worksNavLinkHighlighted)
    highlightWorksNavLink()
  else if (document.scrollingElement && document.scrollingElement.scrollTop < worksPos && worksNavLinkHighlighted)
    highlightHomeNavLink()
}
