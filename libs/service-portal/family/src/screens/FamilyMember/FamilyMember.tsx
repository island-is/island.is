import React from 'react'
import { defineMessage } from 'react-intl'
import { useParams } from 'react-router-dom'
import { useQuery, gql } from '@apollo/client'
import { Query } from '@island.is/api/schema'
import {
  Box,
  Column,
  Columns,
  Divider,
  GridColumn,
  GridRow,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import {
  formatNationalId,
  NotFound,
  ServicePortalModuleComponent,
  UserInfoLine,
  m,
} from '@island.is/service-portal/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  natRegGenderMessageDescriptorRecord,
  natRegMaritalStatusMessageDescriptorRecord,
} from '../../helpers/localizationHelpers'

const NationalRegistryCurrentUserQuery = gql`
  query NationalRegistryCurrentUserQuery {
    nationalRegistryUser {
      nationalId
      spouseName
      spouseNationalId
      spouseCohab
    }
  }
`

const NationalRegistryChildrenQuery = gql`
  query NationalRegistryChildrenQuery {
    nationalRegistryChildren {
      nationalId
      fullName
      genderDisplay
      birthplace
      custodyText1
      nameCustody1
      custodyText2
      nameCustody2
    }
  }
`

const dataNotFoundMessage = defineMessage({
  id: 'sp.family:data-not-found',
  defaultMessage: 'Gögn fundust ekki',
})

const FamilyMember: ServicePortalModuleComponent = () => {
  useNamespaces('sp.family')
  const { formatMessage } = useLocale()

  const { data, loading, error, called } = useQuery<Query>(
    NationalRegistryCurrentUserQuery,
  )
  const { nationalRegistryUser } = data || {}

  const {
    data: childrenData,
    loading: childrenLoading,
    error: childrenError,
    called: childrenCalled,
  } = useQuery<Query>(NationalRegistryChildrenQuery)
  const { nationalRegistryChildren } = childrenData || {}

  const { nationalId }: { nationalId: string | undefined } = useParams()

  const childPerson =
    nationalRegistryChildren?.find((x) => x?.nationalId === nationalId) || null
  const spousePerson =
    nationalRegistryUser?.spouseNationalId === nationalId
      ? nationalRegistryUser
      : null

  if (
    !nationalId ||
    error ||
    childrenError ||
    (!loading && !childPerson && !spousePerson && !childrenLoading)
  )
    return (
      <NotFound
        title={defineMessage({
          id: 'sp.family:family-member-not-found',
          defaultMessage: 'Fjölskyldumeðlimur fannst ekki',
        })}
      />
    )

  const person = spousePerson || childPerson
  console.log('person', person)
  return (
    <>
      <Box marginBottom={6}>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '6/8', '6/8']}>
            <Stack space={2}>
              <Text variant="h3" as="h1">
                {person?.fullName || spousePerson?.spouseName || ''}
              </Text>
            </Stack>
          </GridColumn>
        </GridRow>
      </Box>
      <Stack space={1}>
        <UserInfoLine
          label={defineMessage(m.displayName)}
          content={person?.fullName || spousePerson?.spouseName || '...'}
          loading={loading}
        />
        <Divider />
        <UserInfoLine
          label={defineMessage(m.natreg)}
          content={formatNationalId(nationalId)}
          loading={loading}
        />
        {spousePerson && spousePerson.spouseCohab && (
          <>
            <Divider />
            <UserInfoLine
              label="Tengsl"
              content={spousePerson.spouseCohab}
              loading={loading}
            />
          </>
        )}
        {childPerson && (
          <>
            <Divider />
            <UserInfoLine
              label={defineMessage(m.gender)}
              content={childPerson.genderDisplay}
              loading={loading}
            />
            <Divider />
            <UserInfoLine
              label="Fæðingarstaður"
              content={childPerson.birthplace}
              loading={loading}
            />
            <Divider />
            <UserInfoLine
              label="Foreldrar"
              renderContent={() => (
                <Box>
                  <Box marginBottom={2}>
                    <Text fontWeight="semiBold" variant="small">
                      {childPerson.custodyText1}
                    </Text>
                    <Text variant="small">{childPerson.nameCustody1} </Text>
                  </Box>
                  <Box>
                    <Text fontWeight="semiBold" variant="small">
                      {childPerson.custodyText2}
                    </Text>
                    <Text variant="small">{childPerson.nameCustody2} </Text>
                  </Box>
                </Box>
              )}
              loading={loading}
            />
          </>
        )}
        <Divider />
      </Stack>
    </>
  )
}

export default FamilyMember
