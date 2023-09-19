import { useParams } from 'react-router-dom'
import { useGetHealthDirectorateLicenseByIdQuery } from './HealthDirectorateDetail.generated'
import { Box } from '@island.is/island-ui/core'
import {
  CardLoader,
  EmptyState,
  ErrorScreen,
  ICELAND_ID,
} from '@island.is/service-portal/core'
import { useLocale, useNamespaces } from '@island.is/localization'
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
  useNamespaces('sp.occupational-licenses')
  const user = useUserInfo()
  const birthday = user.profile.dateOfBirth
  const { formatDateFns, formatMessage } = useLocale()

  const { data, loading, error } = useGetHealthDirectorateLicenseByIdQuery({
    variables: {
      id: id,
    },
  })

  const license = data?.occupationalLicensesHealthDirectorateLicense

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
      intro={formatMessage(om.healthDirectorateIntro)}
      serviceProviderID={ICELAND_ID}
      name={user.profile.name}
      dateOfBirth={birthday ? formatDateFns(birthday, 'dd.MM.yyyy') : undefined}
      profession={license.profession}
      licenseType={license.type}
      publisher={formatMessage(om.theDirectorateOfHealth)}
      dateOfIssue={
        license.validFrom
          ? formatDateFns(license.validFrom, 'dd.MM.yyyy')
          : undefined
      }
      isValid={license.isValid}
    />
  )
}

export default EducationDetail
