import React from 'react'
import {
  Text,
  Box,
  Stack,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'
import {
  ServicePortalModuleComponent,
  UserInfoLine,
} from '@island.is/service-portal/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { defineMessage } from 'react-intl'
import { useNationalRegistryInfo } from '@island.is/service-portal/graphql'

const SubjectInfo: ServicePortalModuleComponent = ({ userInfo }) => {
  useNamespaces('sp.family')
  const { formatMessage } = useLocale()
  const { data: natRegInfo } = useNationalRegistryInfo()

  return (
    <>
      <Box marginBottom={6}>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '6/8', '6/8']}>
            <Stack space={2}>
              <Text variant="h1" as="h1">
                {formatMessage({
                  id: 'service.portal:user-info',
                  defaultMessage: 'Mínar upplýsingar',
                })}
              </Text>
              <Text as="p">
                {formatMessage({
                  id: 'sp.family:user-info-description',
                  defaultMessage:
                    'Hér eru þín gögn frá þjóðskrá. Þú hefur kost á að gera breytingar á þessum gögnum',
                })}
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
          content={userInfo.profile.name}
          editLink={{
            external: true,
            title: defineMessage({
              id: 'sp.family:change-name',
              defaultMessage: 'Breyta nafni',
            }),
            url:
              'https://www.skra.is/umsoknir/eydublod-umsoknir-og-vottord/stok-vara/?productid=5c55d7a6-089b-11e6-943d-005056851dd2',
          }}
        />
        <UserInfoLine
          label={defineMessage({
            id: 'service.portal:natreg',
            defaultMessage: 'Kennitala',
          })}
          content={userInfo.profile.natreg}
        />
        <UserInfoLine
          label={defineMessage({
            id: 'service.portal:legal-residence',
            defaultMessage: 'Lögheimili',
          })}
          content={natRegInfo?.legalResidence || '...'}
          editLink={{
            external: true,
            title: defineMessage({
              id: 'sp.family:change-legal-residence',
              defaultMessage: 'Breyta lögheimili',
            }),
            url:
              'https://www.skra.is/umsoknir/rafraen-skil/flutningstilkynning/',
          }}
        />
        <UserInfoLine
          label={defineMessage({
            id: 'service.portal:birth-place',
            defaultMessage: 'Fæðingarstaður',
          })}
          content={natRegInfo?.birthPlace || '...'}
        />
        <UserInfoLine
          label={defineMessage({
            id: 'service.portal:citizenship',
            defaultMessage: 'Ríkisfang',
          })}
          content={
            userInfo.profile.nat === 'IS' ? 'Ísland' : userInfo.profile.nat
          }
        />
        <UserInfoLine
          label={defineMessage({
            id: 'service.portal:gender',
            defaultMessage: 'Kyn',
          })}
          content={natRegInfo?.gender || '...'}
        />
        <UserInfoLine
          label={defineMessage({
            id: 'service.portal:marital-status',
            defaultMessage: 'Hjúskaparstaða',
          })}
          content={natRegInfo?.maritalStatus || '...'}
        />
        <UserInfoLine
          label={defineMessage({
            id: 'service.portal:religion',
            defaultMessage: 'Trúfélag / lífsskoðunarfélag',
          })}
          content={natRegInfo?.religion || '...'}
          editLink={{
            external: true,
            url:
              'https://www.skra.is/umsoknir/rafraen-skil/tru-og-lifsskodunarfelag',
          }}
        />
      </Stack>
    </>
  )
}

export default SubjectInfo
