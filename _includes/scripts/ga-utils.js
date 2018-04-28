window.gaUtils = {
  COOKIE_KEY: 'CID',
  GA_ID: window.config.ga_id,
  API_HOSTNAME: window.config.api.hostname,
  API_GA_PATH: window.config.api.ga_path,

  fetchAndLoadGtag: function() {
    var endpoint = 'https://www.googletagmanager.com/gtag/js?id=' + this.GA_ID
    return loadScript(endpoint, function(err) {
      if (err) {
        log.debug('failed to fetch/load gtag', err)
        log.info('Logging pageview through API')
        this.logPageviewOnServerSide()
      } else {
        log.info('ga refetch success. ga loaded?', window.ga !== undefined) // dont do anything, pageview auto recorded
      }
    })
  },

  getCidFromGaCookie: function() {
    var gaCookie = window.utils.getCookie('_ga')
    if (gaCookie) {
      var cookieSplit = gaCookie.split('.')
      if (cookieSplit && cookieSplit.length === 4) {
        return cookieSplit[2] + '.' +cookieSplit[3]
      }
    }
  },

  // Use our API server to log pageview if client's browser is blocking google analytics
  logPageviewOnServerSide: function() {
    // prioritize _ga cookie if set by google analytics previously
    var cid = this.getCidFromGaCookie() || window.utils.getCookie(this.COOKIE_KEY) || window.utils.readFromStorage(this.COOKIE_KEY)
    log.debug('existing cid', cid)

    if (!cid) {
      cid = window.utils.uuidv4()
      log.debug('generated new cid', cid)
    }

    var wasCookieSet = window.utils.setCookie(this.COOKIE_KEY, cid) // set/update our cookie with latest expiry date
    var writtenToStorage = window.utils.writeToStorage(this.COOKIE_KEY, cid) // store in local storage as a failsafe

    if (!wasCookieSet && !writtenToStorage) {
      log.info('Failed to set cookie and write to storage')
    } else if (!wasCookieSet) {
      log.info('Failed to set cookie')
    } else if (!writtenToStorage) {
      log.info('Failed to write to storage')
    }

    var params = {
      v: 1, // version
      t: 'pageview', // type of hit
      dl: window.location.href, // document url
      dr: document.referrer, // referrer
      ul: (navigator.language || '').toLowerCase(), // user language
      de: document.inputEncoding, // document encoding
      dt: document.title, // document title
      sr: window.screen.width+'x'+window.screen.height, // screen resolution
      cid: cid, // client id
      tid: this.GA_ID, // tracking id
    }
    Object.keys(params).forEach(function(key) { ( params[key] === undefined || (typeof params[key] === 'string' && params[key].length === 0) ) && delete params[key] }) // remove invalid key/value pairs

    fetch(API_HOSTNAME + API_GA_PATH + '?' + window.utils.querystring(params))
      .then(function() {
        log.info('Successfully logged pageview through API')
      })
      .catch(function(ex) {
        log.error('Failed to log pageview through API', ex)
      })
  },

  // Check if GA is defined, if not, try to refetch gtag, and log pageview through server if request is blocked.
  refetchGtagOrLogThroughServer: function() {
    this.fetchAndLoadGtag()
  }
}
