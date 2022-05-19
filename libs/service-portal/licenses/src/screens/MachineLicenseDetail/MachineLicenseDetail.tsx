import React from 'react'
import {
  GenericLicenseType,
  useLicenses,
} from '@island.is/service-portal/graphql'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  Box,
  Divider,
  GridColumn,
  GridRow,
  Stack,
  Text,
  AlertBanner,
} from '@island.is/island-ui/core'
import {
  ServicePortalModuleComponent,
  UserInfoLine,
} from '@island.is/service-portal/core'
import { defineMessage } from 'react-intl'
import { m } from '../../lib/messages'
import { GenericLicenseDataField } from '@island.is/api/schema'

const renderField = (field: GenericLicenseDataField) => {
  return (
    <div>
      {field.name && <Text>{field.name}</Text>}
      {field.label && <Text>{field.label}: </Text>}
      {field.value && <Text>{field.value}</Text>}
      {field.fields && field.fields?.map((val) => renderField(val))}
    </div>
  )
}

const MachineLicenseDetail: ServicePortalModuleComponent = () => {
  useNamespaces('sp.license')
  const { formatMessage } = useLocale()
  const { data, loading, error } = useLicenses(
    GenericLicenseType.MachineLicense,
  )

  return (
    <>
      {error && !loading && (
        <Box>
          <AlertBanner
            description={formatMessage(m.errorFetch)}
            variant="error"
          />
        </Box>
      )}
      <Box marginBottom={5}>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '6/8', '6/8']}>
            <Stack space={1}>
              <Text variant="h3" as="h1" paddingTop={0}>
                Skírteinið þitt
              </Text>
              <Text as="p" variant="default">
                Hér fyrir neðan er placeholder að generic skírteinis content
              </Text>
            </Stack>
          </GridColumn>
        </GridRow>
      </Box>
      {data &&
        data.map((license) => (
          <Stack space={2}>
            <UserInfoLine
              title="Grunnupplýsingar skírteinis"
              label={defineMessage(m.number)}
              content={license.payload?.toString()}
              loading={loading}
              titlePadding={3}
              paddingBottom={1}
              labelColumnSpan={['1/1', '6/12']}
              valueColumnSpan={['1/1', '6/12']}
            />
            <Divider />
            <Box>
              {license.payload?.data.map((field) => renderField(field))}
            </Box>
          </Stack>
        ))}
    </>
  )
}

export default MachineLicenseDetail
