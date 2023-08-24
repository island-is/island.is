import { useParams } from 'react-router-dom'
import { useGetEducationalLicenseByIdQuery } from './EducationalDetail.generated'
import { Box, Button } from '@island.is/island-ui/core'
import {
  CardLoader,
  ErrorScreen,
  formSubmit,
} from '@island.is/service-portal/core'
import { useLocale } from '@island.is/localization'
import { useUserInfo } from '@island.is/auth/react'
import { getOrganizationLogoUrl } from '@island.is/shared/utils'
import { Organization } from '@island.is/shared/types'
import { LicenseDetail } from '../../components/LicenseDetail'
import { useEffect, useState } from 'react'
import { m } from '@island.is/service-portal/core'
import { olMessage as om } from '../../lib/messages'

type UseParams = {
  id: string
}

export const EducationDetail = () => {
  const { id } = useParams() as UseParams

  const user = useUserInfo()
  const birthday = user.profile.dateOfBirth ?? null

  const { formatDateFns, formatMessage } = useLocale()

  const [shouldDownload, setShouldDownload] = useState(false)

  const { data, loading, error } = useGetEducationalLicenseByIdQuery({
    variables: {
      id: id,
    },
  })

  const license = { ...data?.occupationalLicenseEducationalLicense }

  useEffect(() => {
    if (shouldDownload && license.url) {
      formSubmit(license.url)
      setShouldDownload(false)
    }
  }, [shouldDownload, license.url])

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
    return (
      <ErrorScreen
        title={formatMessage(om.errorFetchLicense)}
        tag={formatMessage(m.somethingWrong)}
      />
    )

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
      intro={formatMessage(om.educationIntro)}
      img={organizationImage}
      buttonGroup={
        license.url ? (
          <Box paddingTop="p2">
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
