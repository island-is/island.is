import { useQuery } from '@apollo/client'
import { DrivingLicense, Eligibility, Query } from '@island.is/api/schema'
import { GET_DRIVING_LICENSE } from '../../lib/queries/getDrivingLicense'
interface GetDrivingLicenseProps {
  data?: DrivingLicense
  loading?: boolean
  error?: any
}

export const useDrivingLicense = (): GetDrivingLicenseProps => {
  const { data, loading, error } = useQuery<Query>(GET_DRIVING_LICENSE)

  const license = data?.drivingLicense || ({} as DrivingLicense)

  return {
    data: license,
    loading,
    error,
  }
}
