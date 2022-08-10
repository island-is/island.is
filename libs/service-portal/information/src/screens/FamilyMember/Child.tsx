import React from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { Query } from '@island.is/api/schema'
import { ServicePortalModuleComponent } from '@island.is/service-portal/core'
import ChildView from '../../components/ChildView/ChildView'

import { NATIONAL_REGISTRY_CHILDREN } from '../../lib/queries/getNationalChildren'
import { NATIONAL_REGISTRY_CHILD_GUARDIANSHIP } from '../../lib/queries/getNationalChildGuardianship'

const Child: ServicePortalModuleComponent = ({ userInfo }) => {
  const { nationalId }: { nationalId: string | undefined } = useParams()

  const { data, loading, error } = useQuery<Query>(NATIONAL_REGISTRY_CHILDREN)
  const { nationalRegistryChildren } = data || {}

  const person =
    nationalRegistryChildren?.find((x) => x.nationalId === nationalId) || null

  const isChild = nationalId === userInfo.profile.nationalId

  const { data: guardianshipData } = useQuery<Query>(
    NATIONAL_REGISTRY_CHILD_GUARDIANSHIP,
    {
      variables: { input: { childNationalId: nationalId } },
    },
  )

  const { nationalRegistryUserV2ChildGuardianship: guardianship } =
    guardianshipData || {}

  return (
    <ChildView
      nationalId={nationalId}
      error={error}
      loading={loading}
      person={person}
      isChild={isChild}
      guardianship={
        guardianship?.legalDomicileParent || guardianship?.residenceParent
          ? guardianship
          : null
      }
      hasDetails
    />
  )
}

export default Child
