import React, { FC, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Box } from '@island.is/island-ui/core'

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rsConf: any
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const ReadSpeaker: any

interface WebReaderProps {
  readid?: string
  customerid?: number
}

export const Webreader: FC<WebReaderProps> = ({
  readid = 'main-content',
  customerid = 11963,
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
    const lang = 'is_is'
    const encodedUrl = encodeURIComponent(window.location.href)
    const h =
      '//app-eu.readspeaker.com/cgi-bin/rsent' +
      '?customerid=' +
      customerid +
      '&lang=' +
      lang +
      '&readid=' +
      readid +
      //'&amp;readclass=rs_read' +
      '&url=' +
      encodedUrl
    setHref(h)

    window.rsConf = { general: { usePost: true } }
  }, [href])

  return (
    <>
      <script
        src="//cdn1.readspeaker.com/script/11963/webReader/webReader.js?pids=wr"
        type="text/javascript"
      />
      <Box marginTop={3} marginBottom={3}>
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
