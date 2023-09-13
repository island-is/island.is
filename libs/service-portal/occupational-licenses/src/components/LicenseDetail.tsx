import { Stack, Box, Icon, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { IntroHeader, UserInfoLine } from '@island.is/service-portal/core'
import { olMessage as om } from '../lib/messages'

type LicenseDetailProps = {
  title?: string | null
  intro?: string | null
  serviceProviderID?: string | null
  name?: string | null
  dateOfBirth?: string | null
  profession?: string | null
  licenseType?: string | null
  publisher?: string | null
  dateOfIssue?: string | null
  isValid?: boolean
  buttonGroup?: React.ReactNode
}

export const LicenseDetail: React.FC<LicenseDetailProps> = ({
  title,
  intro,
  serviceProviderID,
  buttonGroup,
  name,
  dateOfBirth,
  profession,
  licenseType,
  publisher,
  dateOfIssue,
  isValid,
}) => {
  const { formatMessage } = useLocale()

  return (
    <Box paddingTop="p1" borderBottomWidth="standard" borderColor="blue200">
      <IntroHeader
        title={title ? title : om.occupationalLicense}
        intro={intro ? intro : undefined}
        serviceProviderID={serviceProviderID ?? undefined}
        buttonGroup={buttonGroup}
      />
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
        {isValid && (
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
                  {formatMessage(isValid ? om.validLicense : om.invalidLicense)}
                </Text>
                <Icon
                  icon={isValid ? 'checkmarkCircle' : 'closeCircle'}
                  color={isValid ? 'mint600' : 'red600'}
                  type="filled"
                />
              </Box>
            }
            labelColumnSpan={['6/12']}
            valueColumnSpan={['6/12']}
          />
        )}
      </Stack>
    </Box>
  )
}
