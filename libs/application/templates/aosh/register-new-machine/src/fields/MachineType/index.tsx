import { FieldBaseProps } from '@island.is/application/types'
import {
  AlertMessage,
  Box,
  GridColumn,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import { FC, useEffect, useState } from 'react'
import { machine } from '../../lib/messages'
import { InputController } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import debounce from 'lodash/debounce'

export const MachineType: FC<React.PropsWithChildren<FieldBaseProps>> = (
  props,
) => {
  const { application, field } = props
  const { formatMessage } = useLocale()

  const [manufacturer, setManufacturer] = useState<string>()
  const [type, setType] = useState<string>()
  const [warning, setWarning] = useState<boolean>(false)
  const [disabled, setDisabled] = useState<boolean>(true)

  useEffect(() => {
    // Call service if manufacturer exists
    // If exists, make type disabled false
    // If not show error message
    if (manufacturer) {
      setWarning(true)
      setDisabled(false)
    }
  }, [manufacturer])

  useEffect(() => {
    // Call service if type exists
    // If not show error message
  }, [type])
  return (
    <Box>
      <Box paddingBottom={2}>
        <Text variant="h5">
          {formatMessage(machine.labels.machineType.inputTitle)}
        </Text>
      </Box>
      <GridRow marginBottom={5}>
        <GridColumn span={['1/1', '1/2']}>
          <InputController
            id={`${field.id}.manufacturer`}
            backgroundColor="blue"
            onChange={debounce((e) => setManufacturer(e.target.value), 300)}
            label={formatMessage(machine.labels.machineType.manufacturer)}
          />
        </GridColumn>
        <GridColumn span={['1/1', '1/2']}>
          <InputController
            id={`${field.id}.type`}
            backgroundColor="blue"
            disabled={disabled}
            onChange={debounce((e) => setType(e.target.value), 300)}
            label={formatMessage(machine.labels.machineType.type)}
          />
        </GridColumn>
      </GridRow>
      {warning && (
        <Box>
          <AlertMessage
            type="warning"
            title={formatMessage(
              machine.labels.machineType.warningAlertMessageTitle,
            )}
            message={formatMessage(
              machine.labels.machineType.warningAlertMessageDescription,
            )}
          />
        </Box>
      )}
    </Box>
  )
}
