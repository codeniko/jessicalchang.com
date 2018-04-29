window.utils = (function (window, document) {
  function uuidv4(a) {
    return a?(a^Math.random()*16>>a/4).toString(16):([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,uuidv4)
  }

  function querystring(params) {
    return Object.keys(params).map(function(key) {
      return key+'='+params[key]
    }).join('&')
  }

  function getCookie(key) {
    if (window.Modernizr.cookies) {
      var cookie = document.cookie
      var i = cookie.indexOf(key)
      if (i >= 0) {
        var end = cookie.indexOf(';', i + 1)
        end = end < 0 ? cookie.length : end
        return cookie.slice(i + key.length + 1, end)
      }
    }
  }

  function setCookie(key, value, daysExpiry, path) {
    daysExpiry = daysExpiry || 365
    path = path || '/'
    if (window.Modernizr.cookies) {
      var date = new Date()
      // Get unix milliseconds at current time plus number of days
      date.setTime(+ date + (daysExpiry * 86400000)) //24 * 60 * 60 * 1000
      document.cookie = key+'='+value+'; expires='+date.toGMTString()+'; path='+path
      return getCookie(key) !== undefined
    }
    return false
  }

  function writeToStorage(key, value) {
    if (window.Modernizr.localstorage) {
      localStorage.setItem(key, value)
      return localStorage.getItem(key) === value
    }
    return false
  }

  function readFromStorage(key) {
    return window.Modernizr.localstorage && localStorage.getItem(key)
  }

  return {
    uuidv4: uuidv4,
    querystring: querystring,
    getCookie: getCookie,
    setCookie: setCookie,
    writeToStorage: writeToStorage,
    readFromStorage: readFromStorage
  }
})(window, document)
