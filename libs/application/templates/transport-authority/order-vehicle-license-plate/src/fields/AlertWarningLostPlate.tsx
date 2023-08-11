import { FieldBaseProps } from '@island.is/application/types'
import { AlertMessage, Box } from '@island.is/island-ui/core'
import { FC } from 'react'
import { useLocale } from '@island.is/localization'
import { information } from '../lib/messages'

export const AlertWarningLostPlate: FC<
  React.PropsWithChildren<FieldBaseProps>
> = () => {
  const { formatMessage } = useLocale()

  return (
    <Box>
      <AlertMessage
        type="warning"
        title={formatMessage(
          information.labels.plateDelivery.warningLostPlateTitle,
        )}
        message={formatMessage(
          information.labels.plateDelivery.warningLostPlateSubTitle,
        )}
      />
    </Box>
  )
}
