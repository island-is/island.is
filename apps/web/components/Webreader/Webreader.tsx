import React, { FC, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Box } from '@island.is/island-ui/core'

interface WebReaderProps {
  readid?: string
  customerid?: number
}

export const Webreader: FC<WebReaderProps> = ({
  readid = 'main-content',
  customerid = 11963,
}) => {
  const [href, setHref] = useState('')
  const history = useHistory()

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

  useEffect(() => {
    console.log(history)
    /*
    return history.listen((location) => {
      console.log(`You changed the page to: ${location.pathname}`)
    })

     */
  }, [history])

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
