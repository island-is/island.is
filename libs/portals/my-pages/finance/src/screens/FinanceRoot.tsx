import { Navigate, useLocation } from 'react-router-dom'
import { ReactNode, useEffect } from 'react'
import { plausibleSwapDataDomain } from '../utils/plausibleSwapDataDomain'
import { FinancePaths } from '../lib/paths'

interface Props {
  children?: ReactNode
}

const FinanceRoot = ({ children }: Props) => {
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
  return children
}

export default FinanceRoot
