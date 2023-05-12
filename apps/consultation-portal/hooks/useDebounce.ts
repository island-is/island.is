import { useEffect, useMemo, useRef } from 'react'
import { debounce } from '../utils/helpers/debounce'

export const useDebounce = (callback, delay: number) => {
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
