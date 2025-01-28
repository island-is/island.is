import { Navigate, useLocation } from 'react-router-dom'
import { Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import { plausibleSwapDataDomain } from '../utils/plausibleSwapDataDomain'
import { FinancePaths } from '../lib/paths'

const FinanceRoot = () => {
  const location = useLocation()

  useEffect(() => {
    plausibleSwapDataDomain('finance')

    return () => {
      plausibleSwapDataDomain('default')
    }
  }, [location])
  if (location.pathname === FinancePaths.FinanceRoot) {
    return <Navigate to={FinancePaths.FinanceStatus} replace />
  }
  return <Outlet />
}

export default FinanceRoot
