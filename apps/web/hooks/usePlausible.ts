import { useEffect, useState } from 'react'
import isEqual from 'lodash/isEqual'

export const usePlausible = (eventName: string, params: unknown) => {
  const [currentParams, setCurrentParams] = useState<unknown>()

  useEffect(() => {
    const maybeWindow = process.browser ? window : undefined

    if (!maybeWindow || !maybeWindow?.plausible) return

    if (!isEqual(currentParams, params)) {
      setCurrentParams(params)
      maybeWindow.plausible(eventName, { props: params })
    }
  }, [currentParams, eventName, params])
}
