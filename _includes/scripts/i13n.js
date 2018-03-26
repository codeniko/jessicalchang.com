// mixin to beacon google analytics and loggly events
window.i13n = {
  beacon: function(payload) {
    _LTracker.push(payload)
  },

  beaconMessage: function(level, message) {
    i13n.beacon({
      type: 'message',
      level: level,
      message: message
    })
  },

  // log to ga as well as beacon
  logException: function(level, message, fatal) {
    gtag('event', 'exception', {
      description: message,
      fatal: fatal || false
    })
    i13n.beaconMessage(level, message)
  },

  // log to ga as well as beacon
  logEvent: function(event, category, label) {
    gtag('event', event, {
      event_category: category || 'www',
      event_label: label || ''
    })

    var payload = {
      type: 'event',
      event: event
    }
    if (category) {
      payload.category = category
    }
    if (label) {
      payload.label = label
    }
    i13n.beacon(payload)
  },

  metric: function(metric, value) {
    i13n.beacon({
      type: 'metric',
      metric: metric,
      value: value
    })
  },

  // logs timing to ga and beacons metric
  timing: function(metric, value) {
    gtag('event', 'timing_complete', {
      name: metric,
      value: value,
      event_category: 'performance'
    })
    i13n.metric(metric, value)
  },

  _timer: {},

  timerStart: function(metric) {
    var timer = i13n._timer
    if (timer[metric]) {
      log.warn("Timing metric '" + metric + "' already started")
    }
    log.debug('timer started for:', metric)
    timer[metric] = +new Date()
  },

  timerStop: function(metric) {
    var stopTime = +new Date()
    var startTime = i13n._timer[metric]
    if (!startTime) {
      log.warn("Timing metric '" + metric + "' wasn't started")
      return
    }
    var diff = stopTime - startTime
    i13n._timer[metric] = undefined
    log.debug('timer stopped for:', metric, 'time=' + diff)
    i13n.timing(metric, diff)
  }
}
