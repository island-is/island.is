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
import { defaultMonths, daysInMonth } from '../../config'
import {
  getMaxMultipleBirthsDays,
  getMultipleBirthRequestDays,
} from '../../lib/parentalLeaveUtils'
import { NO } from '@island.is/application/core'

const MultipleBirthsDaysInput: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
}) => {
  const { formatMessage } = useLocale()
  const { setValue, watch } = useFormContext()

  const maxDays = getMaxMultipleBirthsDays(application.answers)
  const defaultDays = getMultipleBirthRequestDays(application.answers)

  useEffect(() => {
    setValue('requestRights.isRequestingRights', NO)
    setValue('giveRights.isGivingRights', NO)
  }, [setValue])

  const chosenRequestDays = Number(watch('multipleBirthsRequestDays') || 0)

  const totalDays = defaultMonths * daysInMonth + chosenRequestDays
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
            id="multipleBirthsRequestDays"
            name="multipleBirthsRequestDays"
            label={formatMessage(
              parentalLeaveFormMessages.shared.multipleBirthsDaysTitle,
            )}
            type="number"
            defaultValue={String(defaultDays)}
            backgroundColor="blue"
            required
            min={0}
            max={maxDays}
          />
        </GridColumn>
        <GridColumn span={['1/1', '1/2']}>
          <Input
            id="multipleBirthsRequestDays.totalDays"
            name="multipleBirthsRequestDays.totalDays"
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

export default MultipleBirthsDaysInput
