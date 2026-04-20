import { Outlet } from 'react-router-dom'
import { Layout } from '../../components/Layout/Layout'

interface RootProps {
  isSuperAdmin: boolean
}
export const Root = ({ isSuperAdmin }: RootProps) => {
  return (
    <Layout isSuperAdmin={isSuperAdmin}>
      <Outlet />
    </Layout>
  )
}

export default Root
