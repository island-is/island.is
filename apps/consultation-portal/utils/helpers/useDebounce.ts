import { useEffect, useMemo, useRef } from 'react'
import { debounce } from './debounce'

export const useDebounce = (callback: Function, delay: number) => {
  const ref = useRef(null)

  useEffect(() => {
    ref.current = callback
  }, [callback])

  const debouncedCallback = useMemo(() => {
    const func = () => {
      ref.current?.()
    }
    return debounce(func, delay)
  }, [])

  return debouncedCallback
}
