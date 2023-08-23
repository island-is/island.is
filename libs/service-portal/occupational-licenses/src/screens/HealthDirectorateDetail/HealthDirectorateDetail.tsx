import { useUserInfo } from '@island.is/auth/react'
import { Box, SkeletonLoader, Stack } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  ErrorScreen,
  IntroHeader,
  UserInfoLine,
} from '@island.is/service-portal/core'
import { useParams } from 'react-router-dom'
import { useGetOccupationalLicensesQuery } from '../OccupationalLicensesOverview/OccupationalLicensesOverview.generated'

type UseParams = {
  id: string
}

const HealthDirectorateDetail = () => {
  const { id } = useParams() as UseParams

  const { data, loading } = useGetOccupationalLicensesQuery({})

  const theLicense = data
    ? data.occupationalLicenses?.items.find((x) =>
        x.__typename === 'OccupationalLicenseEducationalLicense'
          ? x.id === id
          : x.__typename === 'OccupationalLicenseHealthDirectorateLicense'
          ? x.licenseNumber === id
          : null,
      )
    : null

  const type = theLicense?.__typename

  return <div>hallo</div>
}

export default HealthDirectorateDetail
