import { Box } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { useUserBirthday, useUserInfo } from '@island.is/react-spa/bff'
import {
  CardLoader,
  EmptyState,
  ErrorScreen,
  HEALTH_DIRECTORATE_SLUG,
  m,
} from '@island.is/service-portal/core'
import { useParams } from 'react-router-dom'
import { LicenseDetail } from '../../../components/LicenseDetail'
import { olMessage as om } from '../../../lib/messages'
import { useGetHealthDirectorateLicenseByIdQuery } from './HealthDirectorateDetail.generated'

type UseParams = {
  id: string
}

export const EducationDetail = () => {
  const { id } = useParams() as UseParams
  useNamespaces('sp.occupational-licenses')
  const user = useUserInfo()
  const dateOfBirth = useUserBirthday()
  const { formatDateFns, formatMessage } = useLocale()

  const { data, loading, error } = useGetHealthDirectorateLicenseByIdQuery({
    variables: {
      id: id,
    },
  })

  const license = data?.occupationalLicensesHealthDirectorateLicense?.items[0]

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

  if (!license) return <EmptyState />

  return (
    <LicenseDetail
      title={license.profession}
      serviceProviderSlug={HEALTH_DIRECTORATE_SLUG}
      serviceProviderTooltip={formatMessage(om.healthDirectorateTooltip)}
      name={user.profile.name}
      licenseNumber={
        license.__typename === 'OccupationalLicensesHealthDirectorateLicense'
          ? license.number
          : undefined
      }
      dateOfBirth={
        dateOfBirth ? formatDateFns(dateOfBirth, 'dd.MM.yyyy') : undefined
      }
      profession={license.profession}
      licenseType={license.type}
      dateOfIssue={
        license.validFrom
          ? formatDateFns(license.validFrom, 'dd.MM.yyyy')
          : undefined
      }
      status={license.status}
    />
  )
}

export default EducationDetail
