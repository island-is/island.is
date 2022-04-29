import React from 'react'
import { defineMessage } from 'react-intl'
import { useQuery } from '@apollo/client'
import { spmm } from '../../lib/messages'

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
  id: 'sp.company:data-not-found',
  defaultMessage: 'Gögn fundust ekki',
})

const SubjectInfo: ServicePortalModuleComponent = ({ userInfo }) => {
  useNamespaces('sp.company')
  const { formatMessage } = useLocale()
  const { data, loading, error } = useQuery<Query>(NATIONAL_REGISTRY_USER)
  const { nationalRegistryUser } = data || {}
  console.log('nationalRegistryUser', nationalRegistryUser)
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
                {formatMessage(spmm.company.subtitle)}
              </Text>
            </Stack>
          </GridColumn>
        </GridRow>
      </Box>
      <Stack space={2}>
        <UserInfoLine
          title={formatMessage(m.info)}
          label={formatMessage(spmm.company.name)}
          content={
            error
              ? formatMessage(dataNotFoundMessage)
              : nationalRegistryUser?.birthPlace || ''
          }
          loading={loading}
        />
        <Divider />
        <UserInfoLine
          label={formatMessage(spmm.company.registration)}
          content={error ? formatMessage(dataNotFoundMessage) : '10.01.2012'}
          loading={loading}
        />

        <Divider />
        <UserInfoLine
          label={defineMessage(m.natreg)}
          content={
            error
              ? formatMessage(dataNotFoundMessage)
              : formatNationalId('1111112222')
          }
          loading={loading}
        />
        <Divider />
        <UserInfoLine
          label={m.address}
          content={
            error
              ? formatMessage(dataNotFoundMessage)
              : `${nationalRegistryUser?.legalResidence || ''}`
          }
          loading={loading}
        />
        <Divider />
        <UserInfoLine
          label={formatMessage(spmm.company.taxNr)}
          content={error ? formatMessage(dataNotFoundMessage) : '12345'}
          loading={loading}
        />
        <Divider />
        <UserInfoLine
          label={formatMessage(spmm.company.operationForm)}
          content={
            error
              ? formatMessage(dataNotFoundMessage)
              : 'E1 - Einkahlutafélag (ehf)'
          }
          loading={loading}
        />
        <Divider />
        <UserInfoLine
          label={formatMessage(spmm.company.industryClass)}
          content={
            error
              ? formatMessage(dataNotFoundMessage)
              : '64.19.0 Önnur fjármálafyrirtæki'
          }
          loading={loading}
        />
        <Divider />
      </Stack>
    </>
  )
}

export default SubjectInfo
