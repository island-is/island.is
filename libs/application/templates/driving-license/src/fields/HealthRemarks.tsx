import { FC, useEffect } from 'react'
import { Box, AlertMessage } from '@island.is/island-ui/core'
import { getValueViaPath, NO, YES } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { m } from '../lib/messages'
import { useLocale } from '@island.is/localization'
import { useFormContext } from 'react-hook-form'
import { DrivingLicense } from '../lib/types'
import { DrivingLicenseFakeData } from '../lib/constants'
import { getHealthCertificateRemarks } from '../lib/utils/formUtils'

const HealthRemarks: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
}) => {
  const { formatMessage } = useLocale()
  const rawRemarks = getValueViaPath<DrivingLicense>(
    application.externalData,
    'currentLicense.data',
  )?.remarks
  const remarks = getHealthCertificateRemarks(rawRemarks)
  // Stable scalar dep for the effect below — `remarks` is a freshly filtered
  // array on every render, so depending on it directly would re-fire the
  // setValue call each render and risk a render loop in react-hook-form.
  const hasFilteredRemarks = remarks.length > 0

  const fakeData = getValueViaPath<DrivingLicenseFakeData>(
    application.answers,
    'fakeData',
  )
  const fakeRemarksOff =
    fakeData?.useFakeData === YES && fakeData?.remarks === NO

  const { setValue } = useFormContext()

  useEffect(() => {
    setValue(
      'hasHealthRemarks',
      !fakeRemarksOff && hasFilteredRemarks ? YES : NO,
    )
  }, [hasFilteredRemarks, fakeRemarksOff, setValue])

  if (fakeRemarksOff || !hasFilteredRemarks) {
    return null
  }

  return (
    <Box marginBottom={3}>
      <AlertMessage
        type="warning"
        title={formatMessage(m.healthRemarksTitle)}
        message={
          formatMessage(m.healthRemarksDescription) +
            ' ' +
            remarks.map((r) => r.description).join(', ') || ''
        }
      />
    </Box>
  )
}

export default HealthRemarks
