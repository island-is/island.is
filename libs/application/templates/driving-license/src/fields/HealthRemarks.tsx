import { FC, useEffect } from 'react'
import { Box, AlertMessage } from '@island.is/island-ui/core'
import { formatText, getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { m } from '../lib/messages'
import { useLocale } from '@island.is/localization'
import { useFormContext } from 'react-hook-form'
import { YES, NO } from '../lib/constants'
import { DrivingLicense } from '../lib/types'

const HealthRemarks: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
}) => {
  const { formatMessage } = useLocale()
  const remarks: string[] =
    getValueViaPath<DrivingLicense>(
      application.externalData,
      'currentLicense.data',
    )?.remarks || []

  const { setValue } = useFormContext()

  useEffect(() => {
    setValue('hasHealthRemarks', remarks?.length > 0 ? YES : NO)
  }, [remarks, setValue])

  return (
    <Box marginBottom={3}>
      <AlertMessage
        type="warning"
        title={formatText(m.healthRemarksTitle, application, formatMessage)}
        message={
          formatText(m.healthRemarksDescription, application, formatMessage) +
            ' ' +
            remarks?.join(', ') || ''
        }
      />
    </Box>
  )
}

export default HealthRemarks
