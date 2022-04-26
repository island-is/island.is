import React, { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import some from 'lodash/some'

import { NationalRegistryFamilyMember, Query } from '@island.is/api/schema'
import {
  AlertMessage,
  Box,
  Stack,
  Text,
  GridColumn,
  GridRow,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { ServicePortalModuleComponent, m } from '@island.is/service-portal/core'
import { FamilyMemberCard } from '../../components/FamilyMemberCard/FamilyMemberCard'
import { FamilyMemberCardLoader } from '../../components/FamilyMemberCard/FamilyMemberCardLoader'
import { NATIONAL_REGISTRY_CHILDREN } from '../../lib/queries/getNationalChildren'
import { NATIONAL_REGISTRY_USER } from '../../lib/queries/getNationalRegistryUser'
import { NATIONAL_REGISTRY_FAMILY } from '../../lib/queries/getNationalRegistryFamily'
import { spmm } from '../../lib/messages'

const UserInfoOverview: ServicePortalModuleComponent = ({ userInfo }) => {
  useNamespaces('sp.family')
  const { formatMessage } = useLocale()

  const [childrenOnFamilyNr, setChildrenOnFamilyNr] = useState<
    NationalRegistryFamilyMember[]
  >([])

  // Current User
  const { data, loading, error, called } = useQuery<Query>(
    NATIONAL_REGISTRY_USER,
  )
  const { nationalRegistryUser } = data || {}

  // User's Children
  const { data: childrenData, loading: childrenLoading } = useQuery<Query>(
    NATIONAL_REGISTRY_CHILDREN,
  )
  const { nationalRegistryChildren } = childrenData || {}

  // User's Family members
  const { data: famData, loading: famLoading } = useQuery<Query>(
    NATIONAL_REGISTRY_FAMILY,
  )
  const { nationalRegistryFamily } = famData || {}

  useEffect(() => {
    /**
     * Get children on the same family number who are
     * not in the NATIONAL_REGISTRY_CHILDREN query.
     */
    if (!famLoading && !childrenLoading && nationalRegistryFamily) {
      const familyNrChildren = nationalRegistryFamily?.filter(
        (item) =>
          item.familyRelation === 'child' &&
          !some(nationalRegistryChildren, ['nationalId', item.nationalId]),
      )
      setChildrenOnFamilyNr(familyNrChildren)
    }
  }, [famLoading, childrenLoading])

  const spouseData = nationalRegistryUser?.spouse
  return (
    <>
      <Box marginBottom={[2, 3, 5]}>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '6/8', '6/8']}>
            <Stack space={2}>
              <Text variant="h3" as="h1">
                {formatMessage(m.myInfo)}
              </Text>
              <Text as="p" variant="default">
                {formatMessage(spmm.family.userInfoDesc)}
              </Text>
            </Stack>
          </GridColumn>
        </GridRow>
      </Box>
      <Stack space={2}>
        {called && !loading && !error && !nationalRegistryUser && (
          <AlertMessage type="info" title={formatMessage(m.noDataPresent)} />
        )}
        <FamilyMemberCard
          title={userInfo.profile.name || ''}
          nationalId={userInfo.profile.nationalId}
          currentUser
        />
        {loading && <FamilyMemberCardLoader />}
        {spouseData?.nationalId && (
          <FamilyMemberCard
            key={spouseData.nationalId}
            title={spouseData?.name || ''}
            nationalId={spouseData.nationalId}
            familyRelation="spouse"
          />
        )}
        {childrenLoading &&
          [...Array(2)].map((_key, index) => (
            <FamilyMemberCardLoader key={index} />
          ))}
        {nationalRegistryChildren?.map((familyMember) => (
          <FamilyMemberCard
            key={familyMember.nationalId}
            title={familyMember.fullName || familyMember.displayName || ''}
            nationalId={familyMember.nationalId}
            familyRelation="child"
          />
        ))}
        {childrenOnFamilyNr?.map((child) => (
          <FamilyMemberCard
            key={child.nationalId}
            title={child.fullName || ''}
            nationalId={child.nationalId}
            familyRelation="child2"
          />
        ))}
      </Stack>
    </>
  )
}
export default UserInfoOverview
