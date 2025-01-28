import { useEffect, useState } from 'react'

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      // Check for SSR
      if (!window) {
        return false
      }

      const userAgent = navigator.userAgent
      const mobileRegex =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
      return mobileRegex.test(userAgent)
    }

    setIsMobile(checkMobile())
  }, [])

  return isMobile
}

export default useIsMobile
