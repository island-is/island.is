// prettier-ignore
(function () {
  var script = document.currentScript || document.getElementById('matomo-init')
  var u = script.getAttribute('data-matomo-domain')
  var siteId = script.getAttribute('data-matomo-site-id')
  if (!u || !siteId) {
    console.warn(
      'Matomo tracking is not configured properly. Please check the data-matomo-domain and data-matomo-site-id attributes on the script tag.',
    )
    return
  }
  if (u.charAt(u.length - 1) !== '/') u += '/'
  var _paq = (window._paq = window._paq || [])
  _paq.push(['trackPageView'])
  _paq.push(['enableLinkTracking'])
  _paq.push(['setTrackerUrl', u + 'matomo.php'])
  _paq.push(['setSiteId', siteId])
  var d = document
  var g = d.createElement('script')
  var s = d.getElementsByTagName('script')[0]
  g.async = true
  g.src = u + 'matomo.js'
  s.parentNode.insertBefore(g, s)
})()
