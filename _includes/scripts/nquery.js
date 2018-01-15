// simple class name or id element selector helper to avoid using jquery
function $(selector) {
  if (typeof selector !== 'string' || selector.length === 0)
    return undefined

  var elements = []

  if (selector[0] === '#') {
    var e = document.getElementById(selector.substring(1))
    if (e)
      elements = [e]
  } else if (selector[0] === '.') {
    var e = document.getElementsByClassName(selector.substring(1))
    if (e)
      elements = e
  } else {
    var e = document.getElementsByTagName(selector)
    if (e)
      elements = e
  }

  if (elements.length === 0)
    return undefined

  var classList = (function() {
    // cross browser support
    return this.className.split(' ')
  }).bind(elements[0])

  // get value of element
  elements.val = (function(newValue) {
    if (newValue === undefined)
      return this.value
    else
      this.value = newValue
  }).bind(elements[0])

  elements.addClass = (function(newClass) {
    if (!newClass)
      return

    var classes = classList()
    if (classes.indexOf(newClass) < 0) {
      this.className += ' ' + newClass
    }
  }).bind(elements[0])

  elements.removeClass = (function(rmClass) {
    if (!rmClass)
      return

    var classes = classList()
    var classPos = classes.indexOf(rmClass)
    if (classPos >= 0) {
      classes.splice(classPos, 1)
      this.className = classes.join(' ')
    }
  }).bind(elements[0])

  elements.click = (function(f) {
    if (typeof f !== 'function')
      return

    this.onclick = f
  }).bind(elements[0])

  elements.css = (function(style, value) {
    if (!style || typeof value !== 'string' || value.length === 0)
      return

    this.style[style] = value
  }).bind(elements[0])

  elements.get = (function(i) {
    if (typeof i === 'number')
      return this[i]
    else
      return this[0]
  }).bind(elements)

  return elements
}
