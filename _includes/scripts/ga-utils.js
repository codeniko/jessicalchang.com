window.gaUtils = (function(window, document) {
  var COOKIE_KEY = 'CID'
  var GA_ID = window.config.ga_id
  var API_HOSTNAME = window.config.api.hostname
  var API_GA_PATH = window.config.api.ga_path

  function fetchAndLoadGtag() {
    var endpoint = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID
    return loadScript(endpoint, function(err) {
      if (err) {
        log.debug('failed to fetch/load gtag', err)
        log.info('Logging pageview through API')
        logPageviewOnServerSide()
      } else {
        log.info('ga refetch success. ga loaded?', window.ga !== undefined) // dont do anything, pageview auto recorded
      }
    })
  }

  function getCidFromGaCookie() {
    var gaCookie = window.utils.getCookie('_ga')
    if (gaCookie) {
      var cookieSplit = gaCookie.split('.')
      if (cookieSplit && cookieSplit.length === 4) {
        return cookieSplit[2] + '.' +cookieSplit[3]
      }
    }
  }

  // Use our API server to log pageview if client's browser is blocking google analytics
  function logPageviewOnServerSide() {
    // prioritize _ga cookie if set by google analytics previously
    var cid = getCidFromGaCookie() || window.utils.getCookie(COOKIE_KEY) || window.utils.readFromStorage(COOKIE_KEY)
    log.debug('existing cid', cid)

    if (!cid) {
      cid = window.utils.uuidv4()
      log.debug('generated new cid', cid)
    }

    var wasCookieSet = window.utils.setCookie(COOKIE_KEY, cid) // set/update our cookie with latest expiry date
    var writtenToStorage = window.utils.writeToStorage(COOKIE_KEY, cid) // store in local storage as a failsafe

    if (!wasCookieSet && !writtenToStorage) {
      log.info('Failed to set cookie and write to storage')
    } else if (!wasCookieSet) {
      log.info('Failed to set cookie')
    } else if (!writtenToStorage) {
      log.info('Failed to write to storage')
    }

    var referrer = document.referrer || ''
    var params = {
      v: 1, // version
      t: 'pageview', // type of hit
      dl: window.location.href, // document url
      dr: referrer.indexOf(window.location.origin) !== 0 ? referrer : '', // referrer, don't include referrer if it's set to from own domain
      ul: (navigator.language || '').toLowerCase(), // user language
      de: document.inputEncoding, // document encoding
      dt: document.title, // document title
      sr: window.screen.width+'x'+window.screen.height, // screen resolution
      cid: cid, // client id
      tid: GA_ID, // tracking id
    }
    Object.keys(params).forEach(function(key) { ( params[key] === undefined || params[key] === null || (typeof params[key] === 'string' && params[key].length === 0) ) && delete params[key] }) // remove invalid key/value pairs

    fetch(API_HOSTNAME + API_GA_PATH + '?' + window.utils.querystring(params))
      .then(function() {
        log.info('Successfully logged pageview through API')
      })
      .catch(function(ex) {
        log.error('Failed to log pageview through API', ex)
      })
  }

  // Check if GA is defined, if not, try to refetch gtag, and log pageview through server if request is blocked.
  function refetchGtagOrLogThroughServer() {
    fetchAndLoadGtag()
  }

  return {
    refetchGtagOrLogThroughServer: refetchGtagOrLogThroughServer
  }
})(window, document)
