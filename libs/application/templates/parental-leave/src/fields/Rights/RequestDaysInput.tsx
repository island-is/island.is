import { FC, useEffect } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import { useFormContext } from 'react-hook-form'
import {
  AlertMessage,
  Box,
  GridColumn,
  GridRow,
  Input,
} from '@island.is/island-ui/core'
import { InputController } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { parentalLeaveFormMessages } from '../../lib/messages'
import { daysInMonth, maxDaysToGiveOrReceive } from '../../config'
import { getMaxMultipleBirthsAndDefaultMonths } from '../../lib/parentalLeaveUtils'
import { YES } from '@island.is/application/core'

const RequestDaysInput: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
}) => {
  const { formatMessage } = useLocale()
  const { setValue, watch } = useFormContext()

  useEffect(() => {
    setValue('requestRights.isRequestingRights', YES)
  }, [setValue])

  const chosenRequestDays = Number(watch('requestRights.requestDays') || 0)

  const baseMonths = getMaxMultipleBirthsAndDefaultMonths(application.answers)
  const totalDays = baseMonths * daysInMonth + chosenRequestDays
  const totalMonths = Math.floor(totalDays / daysInMonth)
  const remainingDays = totalDays % daysInMonth

  const totalDisplay =
    remainingDays > 0
      ? `${totalMonths} mánuðir og ${remainingDays} dagar`
      : `${totalMonths} mánuðir`

  return (
    <Box marginBottom={6} marginTop={3}>
      <GridRow>
        <GridColumn span={['1/1', '1/2']}>
          <InputController
            id="requestRights.requestDays"
            name="requestRights.requestDays"
            label={formatMessage(
              parentalLeaveFormMessages.shared.requestDaysInputLabel,
            )}
            type="number"
            defaultValue="0"
            backgroundColor="blue"
            required
            min={1}
            max={maxDaysToGiveOrReceive}
          />
        </GridColumn>
        <GridColumn span={['1/1', '1/2']}>
          <Input
            id="requestRights.totalDays"
            name="requestRights.totalDays"
            label={formatMessage(
              parentalLeaveFormMessages.shared.totalTimeOnLeave,
            )}
            value={totalDisplay}
            readOnly
            backgroundColor="blue"
          />
        </GridColumn>
      </GridRow>
      <Box marginTop={3}>
        <AlertMessage
          type="info"
          title="Athugaðu"
          message={formatMessage(
            parentalLeaveFormMessages.shared.rightsTotalSmallPrint,
          )}
        />
      </Box>
    </Box>
  )
}

export default RequestDaysInput
