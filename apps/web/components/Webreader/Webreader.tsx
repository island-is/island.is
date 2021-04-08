import React, { FC, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Box, ResponsiveProp, Space } from '@island.is/island-ui/core'
import { CUSTOMER_ID, SCRIPT_URL } from './config'

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rsConf: any
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const ReadSpeaker: any

interface WebReaderProps {
  readId?: string
  marginTop?: ResponsiveProp<Space>
  marginBottom?: ResponsiveProp<Space>
}

export const Webreader: FC<WebReaderProps> = ({
  readId = 'main-content',
  marginTop = 3,
  marginBottom = 3,
}) => {
  const [href, setHref] = useState('')
  const router = useRouter()

  useEffect(() => {
    const routeChangestart = (url) => {
      if (typeof ReadSpeaker !== 'undefined') {
        ReadSpeaker.PlayerAPI.stop()

        if (ReadSpeaker.PlayerAPI.audio.state.current) {
          window.location.href = url
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
      el.src = SCRIPT_URL
      el.type = 'text/javascript'
      document.body.appendChild(el)
      window.rsConf = { general: { usePost: true } }
    }
  }, [])

  useEffect(() => {
    const lang = 'is_is'
    const encodedUrl = encodeURIComponent(window.location.href)
    const h =
      '//app-eu.readspeaker.com/cgi-bin/rsent' +
      '?customerid=' +
      CUSTOMER_ID +
      '&lang=' +
      lang +
      '&readid=' +
      readid +
      //'&amp;readclass=rs_read' +
      '&url=' +
      encodedUrl
    setHref(h)
  }, [href])

  return (
    <>
      <Box marginTop={marginTop} marginBottom={marginBottom}>
        <div id="readspeaker_button1" className="rs_skip rsbtn rs_preserve">
          <a
            rel="nofollow"
            className="rsbtn_play"
            accessKey="L"
            title="Hlustaðu á þessa síðu lesna af ReadSpeaker webReader"
            href={href}
          >
            <span className="rsbtn_left rsimg rspart">
              <span className="rsbtn_text">
                <span>Hlusta</span>
              </span>
            </span>
            <span className="rsbtn_right rsimg rsplay rspart" />
          </a>
        </div>
      </Box>
    </>
  )
}
