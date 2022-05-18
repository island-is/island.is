import React from 'react'
import { defineMessage } from 'react-intl'
import format from 'date-fns/format'
import { dateFormat } from '@island.is/shared/constants'
import { useCompanyRegistry } from '@island.is/service-portal/graphql'
import { spmm } from '../../lib/messages'
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

const dataNotFoundMessage = defineMessage({
  id: 'sp.company:data-not-found',
  defaultMessage: 'Gögn fundust ekki',
})

const CompanyInfo: ServicePortalModuleComponent = ({ userInfo }) => {
  useNamespaces('sp.company')
  const { formatMessage } = useLocale()

  const { data, loading, error } = useCompanyRegistry(
    userInfo.profile.nationalId,
  )

  const companyAddress =
    data?.companyInfo?.address?.streetAddress &&
    data?.companyInfo?.address?.postalCode &&
    data?.companyInfo?.address?.locality
      ? `${data.companyInfo.address.streetAddress}, ${data.companyInfo.address.postalCode} ${data.companyInfo.address.locality}`
      : ''

  const companyOperation =
    data?.companyInfo?.formOfOperation?.[0]?.name &&
    data?.companyInfo?.formOfOperation?.[0]?.type
      ? `${data?.companyInfo?.formOfOperation?.[0]?.type} - ${data?.companyInfo?.formOfOperation?.[0]?.name}`
      : ''

  const vatClassification =
    data?.companyInfo?.vat?.[0]?.classification?.[0]?.number &&
    data?.companyInfo?.vat?.[0]?.classification?.[0]?.name
      ? `${data?.companyInfo?.vat?.[0]?.classification?.[0]?.number} ${data?.companyInfo?.vat?.[0]?.classification?.[0]?.name}`
      : ''

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
            error ? formatMessage(dataNotFoundMessage) : data?.name || ''
          }
          loading={loading}
        />
        <Divider />
        <UserInfoLine
          label={formatMessage(spmm.company.registration)}
          content={
            error
              ? formatMessage(dataNotFoundMessage)
              : data?.dateOfRegistration
              ? format(new Date(data.dateOfRegistration), dateFormat.is)
              : ''
          }
          loading={loading}
        />

        <Divider />
        <UserInfoLine
          label={defineMessage(m.natreg)}
          content={
            error
              ? formatMessage(dataNotFoundMessage)
              : data?.nationalId
              ? formatNationalId(data.nationalId)
              : ''
          }
          loading={loading}
        />
        <Divider />
        <UserInfoLine
          label={m.address}
          content={error ? formatMessage(dataNotFoundMessage) : companyAddress}
          loading={loading}
        />
        <Divider />
        <UserInfoLine
          label={formatMessage(spmm.company.taxNr)}
          content={
            error
              ? formatMessage(dataNotFoundMessage)
              : data?.companyInfo?.vat?.[0]?.vatNumber || ''
          }
          loading={loading}
        />
        <Divider />
        <UserInfoLine
          label={formatMessage(spmm.company.operationForm)}
          content={
            error ? formatMessage(dataNotFoundMessage) : companyOperation
          }
          loading={loading}
        />
        <Divider />
        <UserInfoLine
          label={formatMessage(spmm.company.industryClass)}
          content={
            error ? formatMessage(dataNotFoundMessage) : vatClassification
          }
          loading={loading}
        />
        <Divider />
      </Stack>
    </>
  )
}

export default CompanyInfo
