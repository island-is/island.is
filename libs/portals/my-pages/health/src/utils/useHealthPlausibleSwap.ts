import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { plausibleSwapDataDomain } from './plausibleSwapDataDomain'

export const useHealthPlausibleSwap = () => {
  const location = useLocation()

  useEffect(() => {
    plausibleSwapDataDomain('health')
    return () => {
      plausibleSwapDataDomain('default')
    }
  }, [location])
}
