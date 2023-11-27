import { EffectCallback, useEffect, useRef } from 'react'

/**
 * @Note: Use with caution. Please read before usage.
 *
 * This is a hack to get around React strict mode in useEffect.
 * @see https://react.dev/reference/react/StrictMode
 *
 * This hook is used to run an effect only once, on mount, regardless of React >= 18 strict-mode.
 * This hook should generally not be used, but is useful for some edge cases, such as in our AuthProvider.
 */
export const useEffectOnce = (effect: EffectCallback) => {
  const runOnce = useRef(false)

  useEffect(() => {
    if (runOnce.current) return
    runOnce.current = true

    return effect()
  }, [])
}
