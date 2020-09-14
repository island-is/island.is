import { useEffect } from 'react'

type DepType = string | number

export const useScrollTopOnUpdate = (deps: DepType[]) => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }, deps)
}

export default useScrollTopOnUpdate
