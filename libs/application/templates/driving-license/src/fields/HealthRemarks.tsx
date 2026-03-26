import { FC, useEffect } from 'react'
import { Box, AlertMessage } from '@island.is/island-ui/core'
import { getValueViaPath, NO, YES } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { m } from '../lib/messages'
import { useLocale } from '@island.is/localization'
import { useFormContext } from 'react-hook-form'
import { DrivingLicense, Remark } from '../lib/types'
import { DrivingLicenseFakeData } from '../lib/constants'

const HealthRemarks: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
}) => {
  const { formatMessage } = useLocale()
  const remarks: Remark[] =
    getValueViaPath<DrivingLicense>(
      application.externalData,
      'currentLicense.data',
    )?.remarks || []

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
      !fakeRemarksOff && remarks.length > 0 ? YES : NO,
    )
  }, [remarks, fakeRemarksOff, setValue])

  if (fakeRemarksOff) {
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
            remarks?.map((r) => r.description).join(', ') || ''
        }
      />
    </Box>
  )
}

export default HealthRemarks
