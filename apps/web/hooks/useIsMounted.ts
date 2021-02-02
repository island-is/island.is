import { useEffect, useRef } from 'react'

const useIsMounted = () => {
  const isMounted = useRef(true)
  useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [])
  return isMounted
}

export default useIsMounted
