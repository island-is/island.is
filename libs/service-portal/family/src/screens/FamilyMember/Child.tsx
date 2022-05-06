import React from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { Query } from '@island.is/api/schema'
import { ServicePortalModuleComponent } from '@island.is/service-portal/core'
import ChildView from '../../components/ChildView/ChildView'

import { NATIONAL_REGISTRY_CHILDREN } from '../../lib/queries/getNationalChildren'

const Child: ServicePortalModuleComponent = ({ userInfo }) => {
  const { nationalId }: { nationalId: string | undefined } = useParams()

  const { data, loading, error } = useQuery<Query>(NATIONAL_REGISTRY_CHILDREN)
  const { nationalRegistryChildren } = data || {}

  const person =
    nationalRegistryChildren?.find((x) => x.nationalId === nationalId) || null

  const isChild = nationalId === userInfo.profile.nationalId

  return (
    <ChildView
      nationalId={nationalId}
      error={error}
      loading={loading}
      person={person}
      isChild={isChild}
      hasDetails
    />
  )
}

export default Child
