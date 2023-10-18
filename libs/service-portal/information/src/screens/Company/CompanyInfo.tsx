import format from 'date-fns/format'
import React from 'react'
import { defineMessage } from 'react-intl'

import { gql } from '@apollo/client'
import { Divider, Stack } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  EmptyState,
  FootNote,
  formatNationalId,
  IntroHeader,
  m,
  SKATTURINN_ID,
  UserInfoLine,
} from '@island.is/service-portal/core'
import {
  CompanyInfoFragment,
  useCompanyRegistry,
} from '@island.is/service-portal/graphql'
import { dateFormat } from '@island.is/shared/constants'
import { useUserInfo } from '@island.is/auth/react'

import { mCompany } from '../../lib/messages'

const COMPANY_REGISTRY_INFORMATION = gql`
  query companyRegistryCompanyQuery($input: RskCompanyInfoInput!) {
    companyRegistryCompany(input: $input) {
      name
      nationalId
      dateOfRegistration
      companyInfo {
        ...CompanyInfo
      }
    }
  }
  ${CompanyInfoFragment}
`

const dataNotFoundMessage = defineMessage({
  id: 'sp.company:data-not-found',
  defaultMessage: 'Gögn fundust ekki',
})

const CompanyInfo = () => {
  useNamespaces('sp.company')
  const userInfo = useUserInfo()
  const { formatMessage } = useLocale()

  const { data, loading, error } = useCompanyRegistry({
    nationalId: userInfo.profile.nationalId,
    query: COMPANY_REGISTRY_INFORMATION,
  })

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

  const emptyData = data === null
  return (
    <>
      <IntroHeader
        title={userInfo.profile.name}
        intro={mCompany.subtitle}
        serviceProviderID={SKATTURINN_ID}
      />
      {emptyData && <EmptyState />}
      {!emptyData && (
        <Stack space={2}>
          <UserInfoLine
            title={formatMessage(m.info)}
            label={formatMessage(mCompany.name)}
            translate="no"
            content={
              error ? formatMessage(dataNotFoundMessage) : data?.name || ''
            }
            loading={loading}
          />
          <Divider />
          <UserInfoLine
            label={formatMessage(mCompany.registration)}
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
            content={
              error ? formatMessage(dataNotFoundMessage) : companyAddress
            }
            loading={loading}
          />
          <Divider />
          <UserInfoLine
            label={formatMessage(mCompany.taxNr)}
            content={
              error
                ? formatMessage(dataNotFoundMessage)
                : data?.companyInfo?.vat?.[0]?.vatNumber || ''
            }
            loading={loading}
          />
          <Divider />
          <UserInfoLine
            label={formatMessage(mCompany.operationForm)}
            content={
              error ? formatMessage(dataNotFoundMessage) : companyOperation
            }
            loading={loading}
          />
          <Divider />
          <UserInfoLine
            label={formatMessage(mCompany.industryClass)}
            content={
              error ? formatMessage(dataNotFoundMessage) : vatClassification
            }
            loading={loading}
          />
          <Divider />
        </Stack>
      )}
      <FootNote serviceProviderID={SKATTURINN_ID} />
    </>
  )
}

export default CompanyInfo
