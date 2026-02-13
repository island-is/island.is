import { Outlet } from 'react-router-dom'
import { DelegationFormProvider } from '../../context'

export const GrantAccessLayout = () => {
  return (
    <DelegationFormProvider>
      <Outlet />
    </DelegationFormProvider>
  )
}

export default GrantAccessLayout
