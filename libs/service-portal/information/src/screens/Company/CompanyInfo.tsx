import format from 'date-fns/format'
import React from 'react'
import { defineMessage } from 'react-intl'

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
import { dateFormat } from '@island.is/shared/constants'
import { useUserInfo } from '@island.is/auth/react'

import { mCompany } from '../../lib/messages'
import { useCompanyRegistryCompanyQuery } from './Company.generated'

const dataNotFoundMessage = defineMessage({
  id: 'sp.company:data-not-found',
  defaultMessage: 'Gögn fundust ekki',
})

const CompanyInfo = () => {
  useNamespaces('sp.company')
  const userInfo = useUserInfo()
  const { formatMessage } = useLocale()

  const { data, loading, error } = useCompanyRegistryCompanyQuery({
    variables: {
      input: { nationalId: userInfo.profile.nationalId },
    },
  })

  const companyData = data?.companyRegistryCompany
  const companyInfo = companyData?.companyInfo

  const companyAddress =
    companyInfo?.address?.streetAddress &&
    companyInfo?.address?.postalCode &&
    companyInfo?.address?.locality
      ? `${companyInfo.address.streetAddress}, ${companyInfo.address.postalCode} ${companyInfo.address.locality}`
      : ''

  const companyOperation =
    companyInfo?.formOfOperation?.[0]?.name &&
    companyInfo?.formOfOperation?.[0]?.type
      ? `${companyInfo?.formOfOperation?.[0]?.type} - ${companyInfo?.formOfOperation?.[0]?.name}`
      : ''

  const vatDisplay = companyInfo?.vat.filter(
    (item) => item.dateOfDeregistration === null,
  )
  const vatClassification =
    vatDisplay?.[0]?.classification?.[0]?.number &&
    vatDisplay?.[0]?.classification?.[0]?.name
      ? `${vatDisplay?.[0]?.classification?.[0]?.number} ${vatDisplay?.[0]?.classification?.[0]?.name}`
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
              error
                ? formatMessage(dataNotFoundMessage)
                : companyData?.name || ''
            }
            loading={loading}
          />
          <Divider />
          <UserInfoLine
            label={formatMessage(mCompany.registration)}
            content={
              error
                ? formatMessage(dataNotFoundMessage)
                : companyData?.dateOfRegistration
                ? format(
                    new Date(companyData.dateOfRegistration),
                    dateFormat.is,
                  )
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
                : companyData?.nationalId
                ? formatNationalId(companyData.nationalId)
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
                : companyData?.companyInfo?.vat?.[0]?.vatNumber || ''
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
