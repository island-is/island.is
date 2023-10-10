import { useParams } from 'react-router-dom'
import { useGetEducationalLicenseByIdQuery } from './EducationalDetail.generated'
import { Box, Button } from '@island.is/island-ui/core'
import {
  CardLoader,
  EmptyState,
  ErrorScreen,
  MENNTAMALASTOFNUN_ID,
  formSubmit,
  formatDate,
} from '@island.is/service-portal/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { useUserInfo } from '@island.is/auth/react'
import { getOrganizationLogoUrl } from '@island.is/shared/utils'
import { Organization } from '@island.is/shared/types'
import { LicenseDetail } from '../../components/LicenseDetail'
import { useEffect, useState } from 'react'
import { m } from '@island.is/service-portal/core'
import { olMessage as om } from '../../lib/messages'
import { Validity } from '../../components/LicenceActionCard'

type UseParams = {
  id: string
}

export const EducationDetail = () => {
  const { id } = useParams() as UseParams
  useNamespaces('sp.occupational-licenses')

  const user = useUserInfo()
  const birthday = user.profile.dateOfBirth

  const { formatDateFns, formatMessage } = useLocale()

  const [shouldDownload, setShouldDownload] = useState(false)

  const { data, loading, error } = useGetEducationalLicenseByIdQuery({
    variables: {
      id: id,
    },
  })

  const license = data?.occupationalLicensesEducationalLicense

  useEffect(() => {
    if (shouldDownload && license && license.downloadUrl) {
      formSubmit(license.downloadUrl)
      setShouldDownload(false)
    }
  }, [shouldDownload, license])

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
        tag={formatMessage(m.somethingWrong)}
      />
    )

  if (!license) return <EmptyState />

  const programme =
    license.profession.charAt(0).toUpperCase() + license.profession.slice(1)

  return (
    <LicenseDetail
      title={programme}
      serviceProviderID={MENNTAMALASTOFNUN_ID}
      buttonGroup={
        license.downloadUrl ? (
          <Box paddingTop={3}>
            <Button
              variant="utility"
              onClick={() => setShouldDownload(true)}
              icon="download"
            >
              {formatMessage(om.fetchLicense)}
            </Button>
          </Box>
        ) : undefined
      }
      name={user.profile.name}
      dateOfBirth={birthday ? formatDateFns(birthday, 'dd.MM.yyyy') : undefined}
      profession={programme}
      licenseType={programme}
      publisher={license.type}
      dateOfIssue={
        !Number.isNaN(Date.parse(license.validFrom))
          ? formatDateFns(license.validFrom, 'dd.MM.yyyy')
          : undefined
      }
      isValid={license.isValid as Validity}
    />
  )
}

export default EducationDetail
