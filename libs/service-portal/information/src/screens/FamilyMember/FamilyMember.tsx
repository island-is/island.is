import React from 'react'
import { useParams } from 'react-router-dom'
import { gql, useQuery } from '@apollo/client'
import { Query } from '@island.is/api/schema'
import { ServicePortalModuleComponent } from '@island.is/service-portal/core'
import ChildView from '../../components/ChildView/ChildView'

// eslint-disable-next-line local-rules/disallow-kennitalas
const NATIONAL_REGISTRY_FAMILY_DETAIL = gql`
  query NationalRegistryFamilyDetailQuery($input: GetFamilyInfoInput!) {
    nationalRegistryFamilyDetail(input: $input) {
      nationalId
      fullName
      legalResidence
      birthplace
      religion
      genderDisplay
      nationality
      fate
      parent1
      parent2
      nameParent1
      nameParent2
      nameCustody1
      nameCustody2
      custody1
      custody2
      custodyText1
      custodyText2
    }
  }
`

const FamilyMember: ServicePortalModuleComponent = ({ userInfo }) => {
  const { nationalId }: { nationalId: string | undefined } = useParams()

  const { data, loading, error } = useQuery<Query>(
    NATIONAL_REGISTRY_FAMILY_DETAIL,
    {
      variables: { input: { familyMemberNationalId: nationalId } },
    },
  )
  const { nationalRegistryFamilyDetail } = data || {}

  const person =
    nationalRegistryFamilyDetail?.nationalId === nationalId
      ? nationalRegistryFamilyDetail
      : null

  const isChild = nationalId === userInfo.profile.nationalId

  return (
    <ChildView
      nationalId={nationalId}
      error={error}
      loading={loading}
      person={person}
      isChild={isChild}
    />
  )
}

export default FamilyMember
