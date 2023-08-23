import { useParams } from 'react-router-dom'
import { useGetEducationalLicenseByIdQuery } from './EducationalDetail.generated'
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

  const { data, loading, error } = useGetEducationalLicenseByIdQuery({
    variables: {
      id: id,
    },
  })

  const license = { ...data?.occupationalLicenseEducationalLicense }

  const handleDownloadLicense = () => {
    console.log('should down pdf license')
  }

  if (loading)
    return (
      <Box paddingTop="p1">
        <CardLoader />
      </Box>
    )

  if (
    error ||
    !license.date ||
    !license.programme ||
    !license.school ||
    !license.id ||
    !birthday
  )
    return <ErrorScreen title="Ekki tókst að sækja leyfi" tag="Villa" />

  const programme =
    license.programme.charAt(0).toUpperCase() + license.programme.slice(1)

  const isValid = new Date(license.date) < new Date()

  const organizations =
    (data?.getOrganizations?.items as Array<Organization>) ?? []

  const organizationImage = getOrganizationLogoUrl(
    license.school,
    organizations,
    120,
  )

  return (
    <LicenseDetail
      title={programme}
      intro="Hér birtast leyfisbréf kennara sem hafa verið útskrifaðir frá 1988. Bréfin eru sótt til Menntamálastofnunar."
      img={organizationImage}
      onClick={handleDownloadLicense}
      buttonText="Sækja leyfisbréf"
      name={user.profile.name}
      dateOfBirth={formatDateFns(birthday, 'dd.mm.yyyy')}
      profession={programme}
      licenseType={programme}
      publisher={license.school}
      dateOfIssue={formatDateFns(license.date, 'dd.mm.yyyy')}
      isValid={isValid}
    />
  )
}

export default EducationDetail
