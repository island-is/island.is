import React, { useState } from 'react'

const useOnScreen = (ref: any) => {
  const [isIntersecting, setIntersecting] = useState(false)

  const observer = React.useMemo(
    () =>
      new IntersectionObserver(([entry]) =>
        setIntersecting(entry.isIntersecting),
      ),
    [ref],
  )

  React.useEffect(() => {
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return isIntersecting
}

export default useOnScreen
