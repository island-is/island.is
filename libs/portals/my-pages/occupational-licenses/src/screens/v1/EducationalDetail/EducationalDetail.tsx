import { useParams } from 'react-router-dom'
import { useGetEducationalLicenseByIdQuery } from './EducationalDetail.generated'
import { Box, Button } from '@island.is/island-ui/core'
import {
  CardLoader,
  EmptyState,
  ErrorScreen,
  MMS_SLUG,
  formSubmit,
} from '@island.is/portals/my-pages/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { useUserBirthday, useUserInfo } from '@island.is/react-spa/bff'
import { LicenseDetail } from '../../../components/LicenseDetail'
import { useEffect, useState } from 'react'
import { m } from '@island.is/portals/my-pages/core'
import { olMessage as om } from '../../../lib/messages'

type UseParams = {
  id: string
}

const EDUCATION_LICENSE_SIGNED_CERTIFICATE_CUTOFF = new Date(2020, 0, 1)

export const EducationDetail = () => {
  const { id } = useParams() as UseParams
  useNamespaces('sp.occupational-licenses')

  const user = useUserInfo()
  const dateOfBirth = useUserBirthday()

  const { formatDateFns, formatMessage } = useLocale()

  const [shouldDownload, setShouldDownload] = useState(false)

  const { data, loading, error } = useGetEducationalLicenseByIdQuery({
    variables: {
      id: id,
    },
  })

  const license = data?.occupationalLicensesEducationalLicense?.items[0]

  const isOldEducationLicense =
    license?.__typename === 'OccupationalLicensesEducationalLicense' &&
    !!license.validFrom &&
    new Date(license.validFrom) < EDUCATION_LICENSE_SIGNED_CERTIFICATE_CUTOFF

  const downloadUrl =
    license?.__typename === 'OccupationalLicensesEducationalLicense'
      ? license.downloadUrl
      : undefined

  useEffect(() => {
    if (
      shouldDownload &&
      license?.__typename === 'OccupationalLicensesEducationalLicense' &&
      license.downloadUrl
    ) {
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
      serviceProviderSlug={MMS_SLUG}
      buttonGroup={
        downloadUrl ? (
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
      isOldEducationLicense={isOldEducationLicense}
      name={user.profile.name}
      dateOfBirth={
        dateOfBirth ? formatDateFns(dateOfBirth, 'dd.MM.yyyy') : undefined
      }
      profession={programme}
      licenseType={programme}
      publisher={license.type}
      dateOfIssue={
        !Number.isNaN(Date.parse(license.validFrom))
          ? formatDateFns(license.validFrom, 'dd.MM.yyyy')
          : undefined
      }
      status={license.status}
    />
  )
}

export default EducationDetail
