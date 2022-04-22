import React from 'react'
import { defineMessage } from 'react-intl'
import { useQuery } from '@apollo/client'

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
import { NATIONAL_REGISTRY_USER } from '../../lib/queries/getNationalRegistryUser'

const dataNotFoundMessage = defineMessage({
  id: 'sp.family:data-not-found',
  defaultMessage: 'Gögn fundust ekki',
})

const SubjectInfo: ServicePortalModuleComponent = ({ userInfo }) => {
  useNamespaces('sp.family')
  const { formatMessage } = useLocale()
  const { data, loading, error } = useQuery<Query>(NATIONAL_REGISTRY_USER)
  const { nationalRegistryUser } = data || {}
  return (
    <>
      <Box marginBottom={5}>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '6/8', '6/8']}>
            <Stack space={1}>
              <Text variant="h3" as="h1" paddingTop={0}>
                {userInfo.profile.name}
              </Text>
              <Text as="p" variant="default">
                {formatMessage({
                  id: 'sp.family:user-info-description',
                  defaultMessage:
                    'Hér eru gögn um þig og fjölskyldu þína sem sótt eru til Þjóðskrár. Með því að smella á skoða upplýsingar er hægt að óska eftir breytingum á þeim upplýsingum.',
                })}
              </Text>
            </Stack>
          </GridColumn>
        </GridRow>
      </Box>
      <Stack space={2}>
        <UserInfoLine
          title={formatMessage(m.myRegistration)}
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
        <Box marginY={3} />
        <UserInfoLine
          title={formatMessage(m.baseInfo)}
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
        <UserInfoLine
          label={m.banMarking}
          content={
            error
              ? formatMessage(dataNotFoundMessage)
              : nationalRegistryUser?.banMarking?.banMarked
              ? formatMessage({
                  id: 'sp.family:yes',
                  defaultMessage: 'Já',
                })
              : formatMessage({
                  id: 'sp.family:no',
                  defaultMessage: 'Nei',
                })
          }
          tooltip={formatMessage({
            id: 'sp.family:ban-marking-tooltip',
            defaultMessage:
              'Bannmerktir einstaklingar koma t.d. ekki fram á úrtakslistum úr þjóðskrá og öðrum úrtökum í markaðssetningarskyni.',
          })}
          loading={loading}
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
          label={m.citizenship}
          content={
            error
              ? formatMessage(dataNotFoundMessage)
              : nationalRegistryUser?.citizenship?.name || ''
          }
          loading={loading}
        />
        <Divider />
      </Stack>
    </>
  )
}

export default SubjectInfo
