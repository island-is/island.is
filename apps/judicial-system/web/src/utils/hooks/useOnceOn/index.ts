import { useEffect, useRef } from 'react'

const useOnceOn = (condition: boolean, callback: () => void) => {
  const hasRun = useRef(false)

  useEffect(() => {
    if (condition && !hasRun.current) {
      hasRun.current = true
      callback()
    }
  }, [condition, callback])
}

export default useOnceOn
