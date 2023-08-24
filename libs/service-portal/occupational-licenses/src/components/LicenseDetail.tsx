import { Stack, Box } from '@island.is/island-ui/core'
import { IntroHeader } from '@island.is/portals/core'
import { UserInfoLine } from '@island.is/service-portal/core'

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
          label="Nafn einstaklings"
          content={name}
          labelColumnSpan={['6/12']}
          valueColumnSpan={['6/12']}
        />
        <UserInfoLine
          label="Fæðingardagur"
          content={dateOfBirth}
          labelColumnSpan={['6/12']}
          valueColumnSpan={['6/12']}
        />
        <UserInfoLine
          label="Starfstétt"
          content={profession}
          labelColumnSpan={['6/12']}
          valueColumnSpan={['6/12']}
        />
        <UserInfoLine
          label="Tegund leyfis"
          content={licenseType}
          labelColumnSpan={['6/12']}
          valueColumnSpan={['6/12']}
        />
        <UserInfoLine
          label="Úttgefið af"
          content={publisher}
          labelColumnSpan={['6/12']}
          valueColumnSpan={['6/12']}
        />
        <UserInfoLine
          label="Útgáfudagur"
          content={dateOfIssue}
          labelColumnSpan={['6/12']}
          valueColumnSpan={['6/12']}
        />
        <UserInfoLine
          label="Staða"
          content={isValid ? 'Í gildi' : 'Útrunnið'}
          labelColumnSpan={['6/12']}
          valueColumnSpan={['6/12']}
        />
      </Stack>
    </Box>
  )
}
