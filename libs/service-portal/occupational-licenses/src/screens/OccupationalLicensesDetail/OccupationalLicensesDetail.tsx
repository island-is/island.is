import { useParams } from 'react-router-dom'
import { Box, Button, Icon, Stack, Text } from '@island.is/island-ui/core'
import {
  FootNote,
  IntroHeader,
  UserInfoLine,
  formSubmit,
} from '@island.is/service-portal/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { olMessage as om } from '../../lib/messages'
import { useGetOccupationalLicenseByIdQuery } from './OccupationalLicensesDetail.generated'
import { Problem } from '@island.is/react-spa/shared'
import { useMemo } from 'react'

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

  const introHeader = useMemo(() => {
    switch (license?.__typename) {
      case 'OccupationalLicensesV2EducationLicense':
        return (
          <IntroHeader
            marginBottom={2}
            title={license?.title ?? formatMessage(om.occupationalLicense)}
            intro={formatMessage(om.educationIntro)}
            serviceProviderSlug={'menntamalastofnun'}
          >
            <Box paddingTop={3}>
              <Button
                variant="utility"
                onClick={() => {
                  if (license.downloadUrl) {
                    formSubmit(license.downloadUrl)
                  }
                }}
                icon="download"
              >
                {formatMessage(om.fetchLicense)}
              </Button>
            </Box>
          </IntroHeader>
        )
      case 'OccupationalLicensesV2HealthDirectorateLicense':
        return (
          <IntroHeader
            marginBottom={2}
            title={license?.title ?? formatMessage(om.occupationalLicense)}
            intro={formatMessage(om.healthDirectorateIntro)}
            fixedImgWidth
            serviceProviderSlug={'landlaeknir'}
            serviceProviderTooltip={formatMessage(om.healthDirectorateTooltip)}
          />
        )
      case 'OccupationalLicensesV2DistrictCommissionersLicense':
        return (
          <IntroHeader
            marginBottom={2}
            fixedImgWidth
            title={license?.title ?? formatMessage(om.occupationalLicense)}
            serviceProviderSlug={'syslumenn'}
          />
        )
    }
  }, [license, formatMessage])

  return (
    <>
      {introHeader}
      {error && !loading && <Problem noBorder={false} error={error} />}
      <Stack dividers space={2}>
        <UserInfoLine
          loading={loading}
          label={formatMessage(om.nameOfIndividual)}
          content={license?.licenseHolderName ?? 'default nafn'}
        />
        {(license?.dateOfBirth || loading) && (
          <UserInfoLine
            loading={loading}
            label={formatMessage(om.dateOfBirth)}
            content={
              license?.dateOfBirth
                ? formatDateFns(license.dateOfBirth, 'dd.MM.yyyy')
                : undefined
            }
          />
        )}
        {(license?.title || loading) && (
          <UserInfoLine
            loading={loading}
            label={formatMessage(om.profession)}
            content={license?.title ?? ''}
          />
        )}
        {(license?.type || loading) && (
          <UserInfoLine
            loading={loading}
            label={formatMessage(om.typeofLicense)}
            content={license?.type ?? ''}
          />
        )}
        {(license?.issuer || loading) && (
          <UserInfoLine
            loading={loading}
            label={formatMessage(om.publisher)}
            content={license?.issuer}
          />
        )}
        {(license?.validFrom || loading) && (
          <UserInfoLine
            loading={loading}
            label={formatMessage(om.dateOfIssue)}
            content={
              license?.validFrom
                ? formatDateFns(license.validFrom, 'dd.MM.yyyy')
                : undefined
            }
          />
        )}
        {(license?.status || loading) && (
          <UserInfoLine
            loading={loading}
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
                    license?.status === 'VALID'
                      ? om.validLicense
                      : license?.status === 'LIMITED'
                      ? om.validWithLimitationsLicense
                      : om.invalidLicense,
                  )}
                </Text>
                <Icon
                  icon={
                    license?.status === 'VALID'
                      ? 'checkmarkCircle'
                      : license?.status === 'LIMITED'
                      ? 'warning'
                      : 'closeCircle'
                  }
                  color={
                    license?.status === 'VALID'
                      ? 'mint600'
                      : license?.status === 'LIMITED'
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
