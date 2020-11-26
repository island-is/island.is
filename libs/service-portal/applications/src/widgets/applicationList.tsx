import React from 'react'
import {
  ServicePortalModuleComponent,
  ServicePortalPath,
} from '@island.is/service-portal/core'
import ApplicationCard from '../components/ApplicationCard/ApplicationCard'

const ApplicationList: ServicePortalModuleComponent = () => {
  return (
    <>
      <ApplicationCard
        name="Sýnidæmi um umsókn"
        date=""
        isComplete={false}
        url={ServicePortalPath.UmsoknirRoot}
        progress={80}
      />
    </>
  )
}

export default ApplicationList
