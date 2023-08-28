import { Stack, Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { IntroHeader } from '@island.is/portals/core'
import { UserInfoLine } from '@island.is/service-portal/core'
import { olMessage as om } from '../lib/messages'

type LicenseDetailProps = {
  title: string
  intro: string
  img: string
  name: string
  dateOfBirth: string
  profession: string
  licenseType: string
  publisher: string
  dateOfIssue: string
  isValid: boolean
  buttonGroup?: React.ReactNode
}

export const LicenseDetail: React.FC<LicenseDetailProps> = ({
  title,
  intro,
  img,
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
        title={title}
        intro={intro}
        img={img}
        buttonGroup={buttonGroup}
      />
      <Stack dividers space="auto">
        <UserInfoLine
          label={formatMessage(om.nameOfIndividual)}
          content={name}
          labelColumnSpan={['6/12']}
          valueColumnSpan={['6/12']}
        />
        <UserInfoLine
          label={formatMessage(om.dateOfBirth)}
          content={dateOfBirth}
          labelColumnSpan={['6/12']}
          valueColumnSpan={['6/12']}
        />
        <UserInfoLine
          label={formatMessage(om.profession)}
          content={profession}
          labelColumnSpan={['6/12']}
          valueColumnSpan={['6/12']}
        />
        <UserInfoLine
          label={formatMessage(om.typeofLicense)}
          content={licenseType}
          labelColumnSpan={['6/12']}
          valueColumnSpan={['6/12']}
        />
        <UserInfoLine
          label={formatMessage(om.publisher)}
          content={publisher}
          labelColumnSpan={['6/12']}
          valueColumnSpan={['6/12']}
        />
        <UserInfoLine
          label={formatMessage(om.dateOfIssue)}
          content={dateOfIssue}
          labelColumnSpan={['6/12']}
          valueColumnSpan={['6/12']}
        />
        <UserInfoLine
          label={formatMessage(om.licenseStatus)}
          content={formatMessage(isValid ? om.validLicense : om.invalidLicense)}
          labelColumnSpan={['6/12']}
          valueColumnSpan={['6/12']}
        />
      </Stack>
    </Box>
  )
}
