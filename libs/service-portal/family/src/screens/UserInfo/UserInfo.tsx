import React from 'react'
import { defineMessage } from 'react-intl'
import { useQuery, gql } from '@apollo/client'

import { Query } from '@island.is/api/schema'
import {
  Text,
  Box,
  Stack,
  GridRow,
  GridColumn,
  Divider,
} from '@island.is/island-ui/core'
import {
  formatNationalId,
  ServicePortalModuleComponent,
  UserInfoLine,
  m,
} from '@island.is/service-portal/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  natRegGenderMessageDescriptorRecord,
  natRegMaritalStatusMessageDescriptorRecord,
} from '../../helpers/localizationHelpers'

const NationalRegistryUserQuery = gql`
  query NationalRegistryUserQuery {
    nationalRegistryUser {
      nationalId
      maritalStatus
      religion
      legalResidence
      birthPlace
      gender
    }
  }
`

const dataNotFoundMessage = defineMessage({
  id: 'sp.family:data-not-found',
  defaultMessage: 'Gögn fundust ekki',
})

const SubjectInfo: ServicePortalModuleComponent = ({ userInfo }) => {
  useNamespaces('sp.family')
  const { formatMessage } = useLocale()
  const { data, loading, error } = useQuery<Query>(NationalRegistryUserQuery)
  const { nationalRegistryUser } = data || {}

  return (
    <>
      <Box marginBottom={5}>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '6/8', '6/8']}>
            <Stack space={0}>
              <Text variant="h3" as="h1" paddingTop={0}>
                {userInfo.profile.name}
              </Text>
              <Text as="p" variant="default">
                {formatMessage({
                  id: 'sp.family:user-info-description',
                  defaultMessage:
                    'Hér eru þín gögn frá þjóðskrá. Þú hefur kost á að gera breytingar á þessum gögnum.',
                })}
              </Text>
            </Stack>
          </GridColumn>
        </GridRow>
      </Box>
      <Stack space={1}>
        <UserInfoLine
          label={m.displayName}
          content={userInfo.profile.name}
          editLink={{
            external: true,
            title: defineMessage({
              id: 'sp.family:change-in-national-registry',
              defaultMessage: 'Breyta í þjóðskrá',
            }),
            url:
              'https://www.skra.is/umsoknir/eydublod-umsoknir-og-vottord/stok-vara/?productid=5c55d7a6-089b-11e6-943d-005056851dd2',
          }}
        />
        <Divider />
        <UserInfoLine
          label={m.natreg}
          content={formatNationalId(userInfo.profile.nationalId)}
        />
        <Divider />

        <UserInfoLine
          label={m.legalResidence}
          content={
            error
              ? formatMessage(dataNotFoundMessage)
              : nationalRegistryUser?.legalResidence || ''
          }
          loading={loading}
          editLink={{
            external: true,
            title: defineMessage({
              id: 'sp.family:change-in-national-registry',
              defaultMessage: 'Breyta í þjóðskrá',
            }),
            url:
              'https://www.skra.is/umsoknir/rafraen-skil/flutningstilkynning/',
          }}
        />
        <Divider />

        <UserInfoLine
          label={m.birthPlace}
          content={
            error
              ? formatMessage(dataNotFoundMessage)
              : nationalRegistryUser?.birthPlace || ''
          }
          loading={loading}
        />
        <Divider />

        <UserInfoLine
          label={m.citizenship}
          content={
            userInfo.profile.nat === 'IS' ? 'Ísland' : userInfo.profile.nat
          }
        />
        <Divider />

        <UserInfoLine
          label={m.gender}
          content={
            error
              ? formatMessage(dataNotFoundMessage)
              : nationalRegistryUser?.gender
              ? formatMessage(
                  natRegGenderMessageDescriptorRecord[
                    nationalRegistryUser.gender
                  ],
                )
              : ''
          }
          loading={loading}
        />
        <Divider />

        <UserInfoLine
          label={m.maritalStatus}
          content={
            error
              ? formatMessage(dataNotFoundMessage)
              : nationalRegistryUser?.maritalStatus
              ? formatMessage(
                  natRegMaritalStatusMessageDescriptorRecord[
                    nationalRegistryUser?.maritalStatus
                  ],
                )
              : ''
          }
          loading={loading}
        />
        <Divider />

        <UserInfoLine
          label={defineMessage(m.religion)}
          content={
            error
              ? formatMessage(dataNotFoundMessage)
              : nationalRegistryUser?.religion || ''
          }
          loading={loading}
          editLink={{
            external: true,
            title: defineMessage({
              id: 'sp.family:change-in-national-registry',
              defaultMessage: 'Breyta í þjóðskrá',
            }),
            url:
              'https://www.skra.is/umsoknir/rafraen-skil/tru-og-lifsskodunarfelag',
          }}
        />
        <Divider />
      </Stack>
    </>
  )
}

export default SubjectInfo
