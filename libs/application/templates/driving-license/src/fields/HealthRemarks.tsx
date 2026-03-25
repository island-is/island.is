import { FC, useEffect } from 'react'
import { Box, AlertMessage } from '@island.is/island-ui/core'
import { getValueViaPath, NO, YES } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { m } from '../lib/messages'
import { useLocale } from '@island.is/localization'
import { useFormContext } from 'react-hook-form'
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
    // If this component renders, remarks exist on the license —
    // always require health certificate in that case
    setValue('hasHealthRemarks', remarks.length > 0 ? YES : NO)
  }, [remarks, setValue])

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
