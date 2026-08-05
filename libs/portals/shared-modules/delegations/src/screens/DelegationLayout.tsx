import { Outlet } from 'react-router-dom'
import { DelegationFormProvider } from '../context'

export const DelegationLayout = () => (
  <DelegationFormProvider>
    <Outlet />
  </DelegationFormProvider>
)

export default DelegationLayout
