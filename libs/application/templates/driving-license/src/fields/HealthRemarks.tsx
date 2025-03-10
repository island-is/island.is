import { FC, useEffect } from 'react'
import { Box, AlertMessage } from '@island.is/island-ui/core'
import { formatText, getValueViaPath, NO, YES } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { m } from '../lib/messages'
import { useLocale } from '@island.is/localization'
import { useFormContext } from 'react-hook-form'
import { codesRequiringHealthCertificate } from '../lib/constants'
import { DrivingLicense, Remark } from '../lib/types'

const HealthRemarks: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
}) => {
  const { formatMessage } = useLocale()
  const remarks: Remark[] =
    getValueViaPath<DrivingLicense>(
      application.externalData,
      'currentLicense.data',
    )?.remarks || []

  const { setValue } = useFormContext()

  useEffect(() => {
    setValue(
      'hasHealthRemarks',
      remarks.some((r) => codesRequiringHealthCertificate.includes(r.code))
        ? YES
        : NO,
    )
  }, [remarks, setValue])

  return (
    <Box marginBottom={3}>
      <AlertMessage
        type="warning"
        title={formatText(m.healthRemarksTitle, application, formatMessage)}
        message={
          formatText(m.healthRemarksDescription, application, formatMessage) +
            ' ' +
            remarks?.map((r) => r.description).join(', ') || ''
        }
      />
    </Box>
  )
}

export default HealthRemarks
