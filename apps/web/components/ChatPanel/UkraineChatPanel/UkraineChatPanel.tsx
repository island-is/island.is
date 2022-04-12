/* 
    This component will show the Directorate of Immigration live chat for people fleeing the war in Ukraine.
*/

import { useEffect } from 'react'

const LICENSE = 13822368
const VERSION = '2.0'
const SCRIPT_SRC = 'https://cdn.livechatinc.com/tracking.js'

const activateWidget = () => {
  /* eslint-disable */
  const w: any = window
  w.__lc = w.__lc || {}
  w.__lc.license = LICENSE
  const widget = (function (n: any, t, c) {
    function i(n) {
      return e._h ? e._h.apply(null, n) : e._q.push(n)
    }
    var e = {
      _q: [],
      _h: null,
      _v: VERSION,
      on: function () {
        i(['on', c.call(arguments)])
      },
      once: function () {
        i(['once', c.call(arguments)])
      },
      off: function () {
        i(['off', c.call(arguments)])
      },
      get: function () {
        if (!e._h)
          throw new Error("[LiveChatWidget] You can't use getters before load.")
        return i(['get', c.call(arguments)])
      },
      call: function () {
        i(['call', c.call(arguments)])
      },
      init: function () {
        var n = t.createElement('script')
        ;(n.async = !0),
          (n.type = 'text/javascript'),
          (n.src = SCRIPT_SRC),
          t.head.appendChild(n)
      },
    }
    !n.__lc.asyncInit && e.init(), (n.LiveChatWidget = n.LiveChatWidget || e)
    return e
  })(window, document, [].slice)
  return widget
  /* eslint-enable */
}

export const UkraineChatPanel = () => {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const widget: any = activateWidget()
    return () => widget?.call('destroy')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return null
}

export default UkraineChatPanel
