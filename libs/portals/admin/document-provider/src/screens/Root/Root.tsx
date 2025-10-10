import { useLocale } from '@island.is/localization'
import { Layout } from '@island.is/portals/admin/ids-admin'
import { m } from '../../lib/messages'
import { Outlet } from 'react-router-dom'
import { useDocumentProviderNavigation } from '../../hooks/useDocumentProviderNavigation'

export const Root = () => {
  const { formatMessage } = useLocale()
  const navigation = useDocumentProviderNavigation()

  return (
    <Layout navTitle={formatMessage(m.rootName)} navItems={navigation}>
      <Outlet />
    </Layout>
  )
}

export default Root
