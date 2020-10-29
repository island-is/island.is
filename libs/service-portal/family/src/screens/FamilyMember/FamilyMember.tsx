import {
  Box,
  GridColumn,
  GridRow,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import {
  NotFound,
  ServicePortalModuleComponent,
  UserInfoLine,
} from '@island.is/service-portal/core'
import { useNationalRegistryFamilyInfo } from '@island.is/service-portal/graphql'
import React from 'react'
import { defineMessage } from 'react-intl'
import { useParams } from 'react-router-dom'

const FamilyMember: ServicePortalModuleComponent = () => {
  const {
    data: natRegFamilyInfo,
    loading,
    error,
  } = useNationalRegistryFamilyInfo()
  const { nationalId }: { nationalId: string | undefined } = useParams()

  const person =
    natRegFamilyInfo?.find((x) => x.nationalId === nationalId) || null

  if (!nationalId || error || (!loading && !person))
    return (
      <NotFound
        title={defineMessage({
          id: 'sp.family:family-member-not-found',
          defaultMessage: 'Fjölskyldumeðlimur fannst ekki',
        })}
      />
    )

  return (
    <>
      <Box marginBottom={6}>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '6/8', '6/8']}>
            <Stack space={2}>
              <Text variant="h1" as="h1">
                {person?.fullName || ''}
              </Text>
            </Stack>
          </GridColumn>
        </GridRow>
      </Box>
      <Stack space={1}>
        <UserInfoLine
          label={defineMessage({
            id: 'service.portal:display-name',
            defaultMessage: 'Birtingarnafn',
          })}
          content={person?.fullName || '...'}
        />
        <UserInfoLine
          label={defineMessage({
            id: 'service.portal:natreg',
            defaultMessage: 'Kennitala',
          })}
          content={nationalId}
        />
        <UserInfoLine
          label={defineMessage({
            id: 'service.portal:legal-residence',
            defaultMessage: 'Lögheimili',
          })}
          content={person?.address || '...'}
        />
        <UserInfoLine
          label={defineMessage({
            id: 'service.portal:gender',
            defaultMessage: 'Kyn',
          })}
          content={person?.gender || '...'}
        />
        <UserInfoLine
          label={defineMessage({
            id: 'service.portal:marital-status',
            defaultMessage: 'Hjúskaparstaða',
          })}
          content={person?.maritalStatus || '...'}
        />
      </Stack>
    </>
  )
}

export default FamilyMember
