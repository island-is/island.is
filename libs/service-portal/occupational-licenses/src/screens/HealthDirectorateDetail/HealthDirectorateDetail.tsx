import { useParams } from 'react-router-dom'
import { useGetHealthDirectorateLicenseByIdQuery } from './HealthDirectorateDetail.generated'
import { Box } from '@island.is/island-ui/core'
import { CardLoader, ErrorScreen } from '@island.is/service-portal/core'
import { useLocale } from '@island.is/localization'
import { useUserInfo } from '@island.is/auth/react'
import { getOrganizationLogoUrl } from '@island.is/shared/utils'
import { Organization } from '@island.is/shared/types'
import { LicenseDetail } from '../../components/LicenseDetail'

type UseParams = {
  id: string
}

export const EducationDetail = () => {
  const { id } = useParams() as UseParams

  const user = useUserInfo()
  const birthday = user.profile.dateOfBirth ?? null

  const { formatDateFns } = useLocale()

  const { data, loading, error } = useGetHealthDirectorateLicenseByIdQuery({
    variables: {
      id: id,
    },
  })

  const license = { ...data?.occupationalLicenseHealthDirectorateLicense }

  console.log(license)

  if (loading)
    return (
      <Box paddingTop="p1">
        <CardLoader />
      </Box>
    )

  if (
    error ||
    !license.name ||
    !license.profession ||
    !license.license ||
    !license.licenseNumber ||
    !license.validFrom ||
    !birthday
  )
    return <ErrorScreen title="Ekki tókst að sækja leyfi" tag="Villa" />

  const programme = license.profession
  const today = new Date()
  const isValid =
    license.validTo === null || license.validTo === undefined
      ? new Date(license.validFrom) < today
      : new Date(license.validFrom) < today && new Date(license.validTo) > today

  const organizations =
    (data?.getOrganizations?.items as Array<Organization>) ?? []

  const organizationImage = getOrganizationLogoUrl(
    license.name,
    organizations,
    120,
  )

  return (
    <LicenseDetail
      title={programme}
      intro="Starfsleyfi útgefið af Landlæknisembættinu."
      img={organizationImage}
      name={user.profile.name}
      dateOfBirth={formatDateFns(birthday, 'dd.mm.yyyy')}
      profession={license.profession}
      licenseType={license.license}
      publisher={'Embætti Landlæknis'}
      dateOfIssue={formatDateFns(license.validFrom, 'dd.mm.yyyy')}
      isValid={isValid}
    />
  )
}

export default EducationDetail
