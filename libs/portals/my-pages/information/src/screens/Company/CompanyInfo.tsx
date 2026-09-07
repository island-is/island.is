import format from 'date-fns/format'
import React from 'react'
import { defineMessage } from 'react-intl'

import { Box, Divider, Stack, Text } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  FootNote,
  formatNationalId,
  IntroHeader,
  m,
  SKATTURINN_SLUG,
  UserInfoLine,
} from '@island.is/portals/my-pages/core'
import { dateFormat } from '@island.is/shared/constants'
import { useUserInfo } from '@island.is/react-spa/bff'

import { mCompany } from '../../lib/messages'
import { useCompanyRegistryCompanyQuery } from './Company.generated'
import { Problem } from '@island.is/react-spa/shared'

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
    (item) => !item.dateOfDeregistration,
  )

  // A company can be registered for several ISAT activities (one main number
  // and any number of secondary ones), so every classification on the active
  // VAT registrations is listed, not just the first one.
  const vatClassifications = (vatDisplay ?? [])
    .flatMap((item) => item.classification ?? [])
    .filter((item) => item.number && item.name)
    .filter(
      (item, index, all) =>
        all.findIndex((other) => other.number === item.number) === index,
    )

  const emptyData = data?.companyRegistryCompany === null

  return (
    <>
      <IntroHeader
        title={userInfo.profile.name}
        intro={mCompany.subtitle}
        serviceProviderSlug={SKATTURINN_SLUG}
      />
      {error && !loading && <Problem error={error} noBorder={false} />}
      {!error && !loading && emptyData && (
        <Problem
          type="no_data"
          noBorder={false}
          title={formatMessage(m.noData)}
          message={formatMessage(m.noDataFoundDetail)}
          imgSrc="./assets/images/sofa.svg"
        />
      )}
      {!error && (loading || !emptyData) && (
        <Stack space={2}>
          <UserInfoLine
            title={formatMessage(m.info)}
            label={formatMessage(mCompany.name)}
            translate="no"
            content={companyData?.name || ''}
            loading={loading}
          />
          <Divider />
          <UserInfoLine
            label={formatMessage(mCompany.registration)}
            content={
              companyData?.dateOfRegistration
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
              companyData?.nationalId
                ? formatNationalId(companyData.nationalId)
                : ''
            }
            loading={loading}
          />
          <Divider />
          <UserInfoLine
            label={m.address}
            content={companyAddress}
            loading={loading}
          />
          <Divider />
          <UserInfoLine
            label={formatMessage(mCompany.taxNr)}
            content={
              vatDisplay?.[0]?.vatNumber ||
              companyData?.companyInfo?.vat?.[0]?.vatNumber ||
              ''
            }
            loading={loading}
          />
          <Divider />
          <UserInfoLine
            label={formatMessage(mCompany.operationForm)}
            content={companyOperation}
            loading={loading}
          />
          <Divider />
          <UserInfoLine
            label={formatMessage(mCompany.industryClass)}
            content={
              vatClassifications.length ? (
                <Box>
                  {vatClassifications.map((item) => (
                    <Text key={item.number} variant="default">
                      {`${item.number} ${item.name}`}
                    </Text>
                  ))}
                </Box>
              ) : (
                ''
              )
            }
            loading={loading}
          />
          <Divider />
        </Stack>
      )}
      <FootNote serviceProviderSlug={SKATTURINN_SLUG} />
    </>
  )
}

export default CompanyInfo
