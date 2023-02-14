import React, { useState } from 'react'

const useOnScreen = (ref: React.RefObject<HTMLDivElement>) => {
  const [isIntersecting, setIntersecting] = useState(false)

  const observer = React.useMemo(
    () =>
      new IntersectionObserver(([entry]) =>
        setIntersecting(entry.isIntersecting),
      ),
    [],
  )

  React.useEffect(() => {
    observer.observe(ref.current as Element)
    return () => observer.disconnect()
  }, [ref, observer])

  return isIntersecting
}

export default useOnScreen
