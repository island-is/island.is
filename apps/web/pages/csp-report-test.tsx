import { useEffect, useRef } from 'react'

const BLOCKED_ORIGIN = 'https://csp-test.invalid'

const attempt = (operation: () => void | Promise<unknown>) => {
  try {
    const result = operation()

    if (result instanceof Promise) {
      void result.catch(() => undefined)
    }
  } catch {
    return
  }
}

// TEMPORARY: Remove this page after CSP reports have been verified in Datadog.
const CspReportTestPage = () => {
  const hasRun = useRef(false)

  useEffect(() => {
    if (hasRun.current) {
      return
    }

    hasRun.current = true

    attempt(() => {
      const script = document.createElement('script')
      script.src = `${BLOCKED_ORIGIN}/script.js`
      document.head.appendChild(script)
    })

    attempt(() => {
      const stylesheet = document.createElement('link')
      stylesheet.rel = 'stylesheet'
      stylesheet.href = `${BLOCKED_ORIGIN}/stylesheet.css`
      document.head.appendChild(stylesheet)
    })

    attempt(() => {
      const image = new Image()
      image.src = `${BLOCKED_ORIGIN}/image.png`
    })

    attempt(() => {
      const font = new FontFace(
        'CspReportTest',
        `url("${BLOCKED_ORIGIN}/font.woff2")`,
      )
      document.fonts.add(font)
      return font.load()
    })

    attempt(() => {
      const frame = document.createElement('iframe')
      frame.hidden = true
      frame.src = `${BLOCKED_ORIGIN}/frame.html`
      document.body.appendChild(frame)
    })

    attempt(() => {
      const media = document.createElement('video')
      media.preload = 'auto'
      media.src = `${BLOCKED_ORIGIN}/media.mp4`
      media.load()
    })

    attempt(() => {
      const object = document.createElement('object')
      object.hidden = true
      object.data = `${BLOCKED_ORIGIN}/object`
      document.body.appendChild(object)
    })

    attempt(() => {
      const manifest = document.createElement('link')
      manifest.rel = 'manifest'
      manifest.href = `${BLOCKED_ORIGIN}/manifest.webmanifest`
      document.head.appendChild(manifest)
    })

    attempt(() => {
      const worker = new Worker(`${BLOCKED_ORIGIN}/worker.js`)
      worker.addEventListener('error', () => worker.terminate(), { once: true })
    })

    attempt(() => fetch(`${BLOCKED_ORIGIN}/fetch`))

    attempt(() => {
      const socket = new WebSocket('wss://csp-test.invalid/websocket')
      socket.addEventListener('error', () => socket.close(), { once: true })
    })
  }, [])

  return null
}

export default CspReportTestPage
