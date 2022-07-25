import React from 'react'
import { ServicePortalModuleComponent } from '@island.is/service-portal/core'
import { useNamespaces } from '@island.is/localization'
import ApplicationOverview from '../components/ApplicationOverview'
import { ApplicationOverViewStatus } from '../shared/types'

export const Overview: ServicePortalModuleComponent = ({
  userInfo,
  client,
}) => {
  useNamespaces('sp.application')
  return (
    <ApplicationOverview
      userInfo={userInfo}
      client={client}
      statusToShow={ApplicationOverViewStatus.all}
    />
  )
}

export default Overview
