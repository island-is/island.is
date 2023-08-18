import { useUserInfo } from '@island.is/auth/react'
import { Box, Breadcrumbs, Stack } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { IntroHeader, UserInfoLine } from '@island.is/service-portal/core'
import { useParams } from 'react-router-dom'

type UseParams = {
  id: string
}

const OccupationalLicensesDetail = () => {
  const { id } = useParams() as UseParams
  const user = useUserInfo()

  const { formatDateFns } = useLocale()

  console.log(user)

  // TODO: Replace hardcoded text

  // TODO: add query to fetch license by id

  return (
    <Box>
      <Breadcrumbs items={[{ title: 'Yfirlit' }, { title: 'Starfsleyfi' }]} />
      <IntroHeader
        title={'Setja inn viðeigandi starfsheiti'}
        intro={'Setja inn viðeigandi texta'}
      />
      <Stack space="auto" dividers="blueberry200">
        <UserInfoLine
          label="Nafn einstaklings"
          content={user.profile.name}
          labelColumnSpan={['6/12']}
          valueColumnSpan={['6/12']}
        />
        {user.profile.dateOfBirth && (
          <UserInfoLine
            label="Fæðingardagur"
            content={formatDateFns(user.profile.dateOfBirth, 'dd.MM.yyyy')}
            labelColumnSpan={['6/12']}
            valueColumnSpan={['6/12']}
          />
        )}
        <UserInfoLine
          label="Starfstétt"
          content={user.profile.name}
          labelColumnSpan={['6/12']}
          valueColumnSpan={['6/12']}
        />
        <UserInfoLine
          label="Tegund"
          content={user.profile.name}
          labelColumnSpan={['6/12']}
          valueColumnSpan={['6/12']}
        />
        <UserInfoLine
          label="Útgáfudagur"
          content={user.profile.name}
          labelColumnSpan={['6/12']}
          valueColumnSpan={['6/12']}
        />
        <UserInfoLine
          label="Staða"
          content={user.profile.name}
          labelColumnSpan={['6/12']}
          valueColumnSpan={['6/12']}
        />
      </Stack>
    </Box>
  )
}

export default OccupationalLicensesDetail
