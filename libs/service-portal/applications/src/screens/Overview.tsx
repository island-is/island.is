import { ServicePortalModuleComponent } from '@island.is/service-portal/core'
import { useNamespaces } from '@island.is/localization'
import ApplicationOverview from '../components/ApplicationOverview'

export const Overview: ServicePortalModuleComponent = ({
  userInfo,
  client,
}) => {
  useNamespaces('sp.application')
  return <ApplicationOverview userInfo={userInfo} client={client} />
}

export default Overview
