import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { plausibleSwapDataDomain } from './plausibleSwapDataDomain'

export const useFinanceSwapHook = () => {
  const location = useLocation()

  useEffect(() => {
    plausibleSwapDataDomain('finance')
    return () => {
      plausibleSwapDataDomain('default')
    }
  }, [location])
}
