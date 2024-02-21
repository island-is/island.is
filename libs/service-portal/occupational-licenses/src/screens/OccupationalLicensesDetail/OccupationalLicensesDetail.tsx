import { useParams } from 'react-router-dom'
import { Box, Button, Icon, Stack, Text } from '@island.is/island-ui/core'
import {
  CardLoader,
  EmptyState,
  ErrorScreen,
  FootNote,
  HEALTH_DIRECTORATE_SLUG,
  IntroHeader,
  UserInfoLine,
  formSubmit,
} from '@island.is/service-portal/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { useUserInfo } from '@island.is/auth/react'
import { LicenseDetail } from '../../components/LicenseDetail'
import { olMessage as om } from '../../lib/messages'
import { m } from '@island.is/service-portal/core'
import { useGetOccupationalLicenseByIdQuery } from './OccupationalLicensesDetail.generated'
import { useState } from 'react'

type UseParams = {
  id: string
}

const OccupationalLicenseDetail = () => {
  const { id } = useParams() as UseParams
  useNamespaces('sp.occupational-licenses')
  const { formatDateFns, formatMessage } = useLocale()

  const { data, loading, error } = useGetOccupationalLicenseByIdQuery({
    variables: {
      input: { id },
    },
  })

  const license = data?.occupationalLicenseV2

  const introHeader = () => {
    switch (license?.__typename) {
      case 'OccupationalLicensesV2EducationLicense':
        return (
          <IntroHeader
            title={license?.title ?? formatMessage(om.occupationalLicense)}
            intro={formatMessage(om.educationIntro)}
            serviceProviderSlug={'syslumenn'}
            introComponent={
              <Box paddingTop={3}>
                <Button
                  variant="utility"
                  onClick={() => {
                    if (license.downloadURI) {
                      formSubmit(license.downloadURI)
                    }
                  }}
                  icon="download"
                >
                  {formatMessage(om.fetchLicense)}
                </Button>
              </Box>
            }
          />
        )
      case 'OccupationalLicensesV2HealthDirectorateLicense':
        return (
          <IntroHeader
            title={license?.title ?? formatMessage(om.occupationalLicense)}
            intro={formatMessage(om.healthDirectorateIntro)}
            serviceProviderSlug={'landlaeknir'}
            serviceProviderTooltip={formatMessage(om.healthDirectorateTooltip)}
          />
        )
      case 'OccupationalLicensesV2DistrictCommissionersLicense':
        return (
          <IntroHeader
            title={license?.title ?? formatMessage(om.occupationalLicense)}
            serviceProviderSlug={'syslumenn'}
          />
        )
    }
  }

  return (
    <>
      <Stack dividers space={2}>
        {introHeader()}
        {license?.licenseHolderName && (
          <UserInfoLine
            label={formatMessage(om.nameOfIndividual)}
            content={license.licenseHolderName}
          />
        )}
        {license?.dateOfBirth && (
          <UserInfoLine
            label={formatMessage(om.dateOfBirth)}
            content={formatDateFns(license.dateOfBirth, 'DD.MM.YYY')}
          />
        )}
        {license?.profession && (
          <UserInfoLine
            label={formatMessage(om.profession)}
            content={license.profession}
          />
        )}
        {license?.type && (
          <UserInfoLine
            label={formatMessage(om.typeofLicense)}
            content={license.type}
          />
        )}
        {license?.issuer && (
          <UserInfoLine
            label={formatMessage(om.publisher)}
            content={license.issuer}
          />
        )}
        {license?.validFrom && (
          <UserInfoLine
            label={formatMessage(om.dateOfIssue)}
            content={formatDateFns(license.validFrom, 'DD.MM.YYYY')}
          />
        )}
        {license?.status && (
          <UserInfoLine
            label={formatMessage(om.licenseStatus)}
            content={
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                columnGap="p1"
              >
                <Text>
                  {formatMessage(
                    license.status === 'VALID'
                      ? om.validLicense
                      : license.status === 'LIMITED'
                      ? om.validWithLimitationsLicense
                      : om.invalidLicense,
                  )}
                </Text>
                <Icon
                  icon={
                    license.status === 'VALID'
                      ? 'checkmarkCircle'
                      : license.status === 'LIMITED'
                      ? 'warning'
                      : 'closeCircle'
                  }
                  color={
                    license.status === 'VALID'
                      ? 'mint600'
                      : license.status === 'LIMITED'
                      ? 'yellow600'
                      : 'red600'
                  }
                  type="filled"
                />
              </Box>
            }
          />
        )}
      </Stack>
      <FootNote
        serviceProviderSlug={
          license?.__typename ===
          'OccupationalLicensesV2DistrictCommissionersLicense'
            ? 'syslumenn'
            : license?.__typename === 'OccupationalLicensesV2EducationLicense'
            ? 'menntamalastofnun'
            : 'landlaeknir'
        }
      />
    </>
  )
}

export default OccupationalLicenseDetail
