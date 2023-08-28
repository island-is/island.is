import { useParams } from 'react-router-dom'
import { useGetHealthDirectorateLicenseByIdQuery } from './HealthDirectorateDetail.generated'
import { Box } from '@island.is/island-ui/core'
import { CardLoader, ErrorScreen } from '@island.is/service-portal/core'
import { useLocale } from '@island.is/localization'
import { useUserInfo } from '@island.is/auth/react'
import { getOrganizationLogoUrl } from '@island.is/shared/utils'
import { Organization } from '@island.is/shared/types'
import { LicenseDetail } from '../../components/LicenseDetail'
import { olMessage as om } from '../../lib/messages'
import { m } from '@island.is/service-portal/core'

type UseParams = {
  id: string
}

export const EducationDetail = () => {
  const { id } = useParams() as UseParams

  const user = useUserInfo()
  const birthday = user.profile.dateOfBirth ?? null

  const { formatDateFns, formatMessage } = useLocale()

  const { data, loading, error } = useGetHealthDirectorateLicenseByIdQuery({
    variables: {
      id: id,
    },
  })

  const license = { ...data?.OccupationalLicensesHealthDirectorateLicense }

  if (loading)
    return (
      <Box paddingTop="p1">
        <CardLoader />
      </Box>
    )

  if (error)
    return (
      <ErrorScreen
        title={formatMessage(om.errorFetchLicense)}
        tag={formatMessage(m.errorFetch)}
      />
    )

  const programme = license.profession
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
      intro={formatMessage(om.healthDirectorateIntro)}
      img={organizationImage}
      name={user.profile.name}
      dateOfBirth={formatDateFns(birthday, 'dd.mm.yyyy')}
      profession={license.profession}
      licenseType={license.license}
      publisher={formatMessage(om.theDirectorateOfHealth)}
      dateOfIssue={formatDateFns(license.validFrom, 'dd.mm.yyyy')}
      isValid={license.isValid}
    />
  )
}

export default EducationDetail
