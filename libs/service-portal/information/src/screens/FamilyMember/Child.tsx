import React from 'react'
import { useParams } from 'react-router-dom'
import { gql, useQuery } from '@apollo/client'
import { Query } from '@island.is/api/schema'
import { ServicePortalModuleComponent } from '@island.is/service-portal/core'
import ChildView from '../../components/ChildView/ChildView'

const ChildGuardianshipQuery = gql`
  query NationalRegistryChildrenGuardianshipQuery(
    $input: NationalRegistryXRoadChildGuardianshipInput!
  ) {
    nationalRegistryUserV2ChildGuardianship(input: $input) {
      legalDomicileParent
      residenceParent
    }
  }
`

const ChildrenQuery = gql`
  query NationalRegistryChildrenQuery {
    nationalRegistryChildren {
      nationalId
      fullName
      displayName
      genderDisplay
      birthplace
      custody1
      custodyText1
      nameCustody1
      custody2
      custodyText2
      nameCustody2
      parent1
      nameParent1
      parent2
      nameParent2
      homeAddress
      religion
      nationality
      fate
      religion
      homeAddress
      nationality
      legalResidence
    }
  }
`

export const NATIONAL_REGISTRY_USER_NAME = gql`
  query NationalRegistryUserNameQuery {
    nationalRegistryUser {
      nationalId
      fullName
    }
  }
`

const Child: ServicePortalModuleComponent = ({ userInfo }) => {
  const { nationalId }: { nationalId: string | undefined } = useParams()

  const { data: userData } = useQuery<Query>(NATIONAL_REGISTRY_USER_NAME)
  const { data, loading, error } = useQuery<Query>(ChildrenQuery)
  const { nationalRegistryChildren } = data || {}

  const person =
    nationalRegistryChildren?.find((x) => x.nationalId === nationalId) || null

  const isChild = nationalId === userInfo.profile.nationalId

  const { data: guardianshipData } = useQuery<Query>(ChildGuardianshipQuery, {
    variables: { input: { childNationalId: nationalId } },
  })

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
      userName={userData?.nationalRegistryUser?.fullName}
      userNationalId={userInfo.profile.nationalId}
      hasDetails
    />
  )
}

export default Child
