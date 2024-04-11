import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@apollo/client'

import { Query, QueryGetNamespaceArgs } from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'
import { useI18n } from '@island.is/web/i18n'
import { GET_NAMESPACE_QUERY } from '@island.is/web/screens/queries'

import { ChatBubble } from '../ChatBubble'
import { LiveChatIncChatPanelProps } from '../types'

const SCRIPT_SRC = 'https://cdn.livechatinc.com/tracking.js'

const activateWidget = (license: number, version: string, group?: number) => {
  /* eslint-disable */
  const w: any = window
  w.__lc = w.__lc || {}
  w.__lc.license = license

  if (typeof group === 'number') {
    w.__lc.group = group
  }

  const widget = (function (n: any, t, c) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore make web strict
    function i(n) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore make web strict
      return e._h ? e._h.apply(null, n) : e._q.push(n)
    }
    var e = {
      _q: [],
      _h: null,
      _v: version,
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

export const LiveChatIncChatPanel = ({
  license,
  version,
  group,
  showLauncher,
  pushUp,
}: LiveChatIncChatPanelProps) => {
  const [widget, setWidget] = useState(null)
  const { activeLocale } = useI18n()
  const { data } = useQuery<Query, QueryGetNamespaceArgs>(GET_NAMESPACE_QUERY, {
    variables: {
      input: {
        lang: activeLocale,
        namespace: 'ChatPanels',
      },
    },
  })

  const namespace = useMemo(
    () => JSON.parse(data?.getNamespace?.fields || '{}'),
    [data?.getNamespace?.fields],
  )

  const n = useNamespace(namespace)

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const widget: any = activateWidget(license, version, group)
    setWidget(widget)

    return () => widget?.call('destroy')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (showLauncher) {
    return null
  }

  return (
    <ChatBubble
      text={n('chatBubbleText', 'Hæ, get ég aðstoðað?')}
      onClick={() => {
        widget?.call('maximize')
      }}
      pushUp={pushUp}
    />
  )
}

export default LiveChatIncChatPanel
