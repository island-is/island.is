import React, { FC, useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import { Box, ResponsiveProp, Space } from '@island.is/island-ui/core'
import { useI18n } from '@island.is/web/i18n'

import { CUSTOMER_ID, SCRIPT_URL } from './config'

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rsConf: any
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const ReadSpeaker: any

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const rspkr: any
interface WebReaderProps {
  readId?: string
  readClass?: string
  marginTop?: ResponsiveProp<Space>
  marginBottom?: ResponsiveProp<Space>
}

const Webreader: FC<React.PropsWithChildren<WebReaderProps>> = ({
  readId = 'main-content',
  readClass,
  marginTop = 3,
  marginBottom = 3,
}) => {
  const [href, setHref] = useState('')
  const router = useRouter()
  const { activeLocale } = useI18n()

  useEffect(() => {
    const routeChangestart = () => {
      if (typeof ReadSpeaker !== 'undefined' && ReadSpeaker.PlayerAPI?.stop) {
        ReadSpeaker.PlayerAPI.stop()

        if (ReadSpeaker.PlayerAPI.audio.state.current && rspkr.ui) {
          // We need to untangle the dom manipulation that happens
          // on behalf of the ReadSpeaker client.
          // This is most easily done by closing the player programatically through
          // the rspkr object and have it handle its own cleanup
          ReadSpeaker.q(() => {
            if (rspkr.ui.getActivePlayer()) {
              rspkr.ui.getActivePlayer().close()
            }
          })
        }
      }
    }

    router.events.on('routeChangeStart', routeChangestart)

    return () => {
      router.events.off('routeChangeStart', routeChangestart)
    }
  }, [])

  useEffect(() => {
    if (!window.rsConf) {
      const el = document.createElement('script')
      el.id = 'rs_req_Init'
      el.src = SCRIPT_URL
      el.type = 'text/javascript'
      document.body.appendChild(el)
      window.rsConf = { general: { usePost: true } }
    } else if (typeof rspkr !== 'undefined' && rspkr.ui) {
      // https://wrdev.readspeaker.com/get-started/implementation/dynamic-loading
      // When a parent component, with the webreader, has been unmounted
      // the readspeaker will still remain initialized
      // but in order for functionality to be added to the new button
      // we need to call 'addClickEvents'
      window.onload = () => {
        rspkr.init()
        rspkr.ui.addClickEvents()
      }
    }
  }, [])

  useEffect(() => {
    const lang = activeLocale === 'is' ? 'is_is' : 'en_uk'
    let h =
      '//app-eu.readspeaker.com/cgi-bin/rsent' +
      '?customerid=' +
      CUSTOMER_ID +
      '&lang=' +
      lang +
      '&url=' +
      encodeURIComponent(window.location.href)

    if (readId) {
      h += '&readid=' + readId
    }
    if (readClass) {
      h += '&readclass=' + readClass
    }
    setHref(h)
  }, [href])

  const buttonLabel = activeLocale === 'is' ? 'Hlusta' : 'Listen'
  const buttonTitle =
    activeLocale === 'is'
      ? 'Hlustaðu á þessa síðu lesna af ReadSpeaker webReader'
      : 'Listen to this page using ReadSpeaker'

  return (
    <Box marginTop={marginTop} marginBottom={marginBottom} printHidden={true}>
      <div id="readspeaker_button1" className="rs_skip rsbtn rs_preserve">
        <a
          rel="nofollow"
          className="rsbtn_play"
          accessKey="L"
          title={buttonTitle}
          href={href}
          onClick={(event) => {
            event.preventDefault() // So the Plausible outbound link tracking script doesn't open the href
          }}
        >
          <span className="rsbtn_left rsimg rspart">
            <span className="rsbtn_text">
              <span>{buttonLabel}</span>
            </span>
          </span>
          <span className="rsbtn_right rsimg rsplay rspart" />
        </a>
      </div>
    </Box>
  )
}

export default Webreader
