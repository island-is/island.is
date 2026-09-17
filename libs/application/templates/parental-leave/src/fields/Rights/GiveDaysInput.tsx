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
import {
  defaultMonths,
  daysInMonth,
  maxDaysToGiveOrReceive,
} from '../../config'
import { YES } from '@island.is/application/core'

const GiveDaysInput: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application: _application,
}) => {
  const { formatMessage } = useLocale()
  const { setValue, watch } = useFormContext()

  useEffect(() => {
    setValue('giveRights.isGivingRights', YES)
  }, [setValue])

  const giveDays = Number(watch('giveRights.giveDays') || 0)

  const baseDays = defaultMonths * daysInMonth
  const totalDays = baseDays - giveDays
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
            id="giveRights.giveDays"
            name="giveRights.giveDays"
            label={formatMessage(
              parentalLeaveFormMessages.shared.giveDaysInputLabel,
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
            id="giveRights.totalDays"
            name="giveRights.totalDays"
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
            parentalLeaveFormMessages.shared.giveDaysInfoAlert,
          )}
        />
      </Box>
    </Box>
  )
}

export default GiveDaysInput
