import { useEffect, createRef, RefObject, useState } from 'react'

type DepType = string | number

export const useScrollToRefOnUpdate = (
  deps: DepType[],
): { scrollToRef: RefObject<HTMLDivElement> } => {
  const [isFirstRun, setIsFirstRun] = useState(true)
  const scrollToRef = createRef<HTMLDivElement>()
  useEffect(() => {
    // Skippinging initial scroll to ref on render.
    if (isFirstRun) {
      setIsFirstRun(false)
      return
    }
    const offset = 168
    const refPosition = scrollToRef?.current?.offsetTop || 0
    window.scrollTo({
      top: Math.max(refPosition - offset, 0),
      behavior: 'smooth',
    })
  }, deps)
  return { scrollToRef }
}

export default useScrollToRefOnUpdate
