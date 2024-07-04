import { Stack, Box, Icon, Text, AlertMessage } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  IntroHeader,
  UserInfoLine,
  FootNote,
} from '@island.is/service-portal/core'
import { olMessage as om } from '../lib/messages'
import { OccupationalLicenseStatus } from '@island.is/api/schema'
import { OrganizationSlugType } from '@island.is/shared/constants'

type LicenseDetailProps = {
  title?: string | null
  intro?: string | null
  serviceProviderSlug?: OrganizationSlugType
  serviceProviderTooltip?: string
  isOldEducationLicense?: boolean
  name?: string | null
  dateOfBirth?: string | null
  profession?: string | null
  licenseType?: string | null
  publisher?: string | null
  dateOfIssue?: string | null
  status?: OccupationalLicenseStatus
  buttonGroup?: React.ReactNode
}

export const LicenseDetail: React.FC<LicenseDetailProps> = ({
  title,
  intro,
  serviceProviderSlug,
  serviceProviderTooltip,
  isOldEducationLicense,
  buttonGroup,
  name,
  dateOfBirth,
  profession,
  licenseType,
  publisher,
  dateOfIssue,
  status,
}) => {
  const { formatMessage } = useLocale()

  return (
    <Box paddingTop="p1" borderBottomWidth="standard" borderColor="blue200">
      <IntroHeader
        title={title ? title : om.occupationalLicense}
        intro={intro ? intro : undefined}
        serviceProviderSlug={serviceProviderSlug}
        serviceProviderTooltip={serviceProviderTooltip}
        children={!isOldEducationLicense ? buttonGroup : undefined}
      />
      {isOldEducationLicense && (
        <AlertMessage
          type="warning"
          title={formatMessage(om.educationLicenseDigitalUnavailable)}
          message={formatMessage(
            om.educationLicenseDigitalUnavailableDescription,
          )}
        />
      )}
      <Stack dividers space="auto">
        {name && (
          <UserInfoLine
            paddingY={3}
            label={formatMessage(om.nameOfIndividual)}
            content={name}
            labelColumnSpan={['6/12']}
            valueColumnSpan={['6/12']}
          />
        )}
        {dateOfBirth && (
          <UserInfoLine
            paddingY={3}
            label={formatMessage(om.dateOfBirth)}
            content={dateOfBirth}
            labelColumnSpan={['6/12']}
            valueColumnSpan={['6/12']}
          />
        )}
        {profession && (
          <UserInfoLine
            paddingY={3}
            label={formatMessage(om.profession)}
            content={profession}
            labelColumnSpan={['6/12']}
            valueColumnSpan={['6/12']}
          />
        )}
        {licenseType && (
          <UserInfoLine
            paddingY={3}
            label={formatMessage(om.typeofLicense)}
            content={licenseType}
            labelColumnSpan={['6/12']}
            valueColumnSpan={['6/12']}
          />
        )}
        {publisher && (
          <UserInfoLine
            paddingY={3}
            label={formatMessage(om.publisher)}
            content={publisher}
            labelColumnSpan={['6/12']}
            valueColumnSpan={['6/12']}
          />
        )}
        {dateOfIssue && (
          <UserInfoLine
            paddingY={3}
            label={formatMessage(om.dateOfIssue)}
            content={dateOfIssue}
            labelColumnSpan={['6/12']}
            valueColumnSpan={['6/12']}
          />
        )}
        {!isOldEducationLicense && status && (
          <UserInfoLine
            paddingY={3}
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
                    status === 'valid'
                      ? om.validLicense
                      : status === 'limited'
                      ? om.validWithLimitationsLicense
                      : status === 'revoked'
                      ? om.revokedLicense
                      : status === 'waived'
                      ? om.waivedLicense
                      : om.invalidLicense,
                  )}
                </Text>
                <Icon
                  icon={
                    status === 'valid'
                      ? 'checkmarkCircle'
                      : status === 'limited'
                      ? 'warning'
                      : 'closeCircle'
                  }
                  color={
                    status === 'valid'
                      ? 'mint600'
                      : status === 'limited'
                      ? 'yellow600'
                      : 'red600'
                  }
                  type="filled"
                />
              </Box>
            }
            labelColumnSpan={['6/12']}
            valueColumnSpan={['6/12']}
          />
        )}
      </Stack>
      <FootNote serviceProviderSlug={serviceProviderSlug} />
    </Box>
  )
}
