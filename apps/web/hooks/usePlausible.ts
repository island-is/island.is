import { useEffect } from 'react'

export const plausibleCustomEvent = (eventName: string, params: Object) => {
  useEffect(() => {
    const maybeWindow = process.browser ? window : undefined

    if (maybeWindow?.plausible) {
      maybeWindow.plausible(eventName, { props: { params } })
    }
  }, [])
}
