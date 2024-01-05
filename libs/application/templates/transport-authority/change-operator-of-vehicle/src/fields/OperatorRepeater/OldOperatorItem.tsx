import { FieldBaseProps } from '@island.is/application/types'
import {
  Box,
  Text,
  Button,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { information } from '../../lib/messages'
import { OldOperatorInformationFormField } from '../../shared'
import { InputController } from '@island.is/shared/form-fields'
import { getErrorViaPath } from '@island.is/application/core'

interface Props {
  id: string
  index: number
  rowLocation: number
  repeaterField: OldOperatorInformationFormField
  handleRemove: (index: number) => void
}

export const OldOperatorItem: FC<
  React.PropsWithChildren<Props & FieldBaseProps>
> = ({ id, index, rowLocation, handleRemove, repeaterField, errors }) => {
  const { formatMessage } = useLocale()
  const { setValue } = useFormContext()
  const fieldIndex = `${id}[${index}]`
  const wasRemovedField = `${fieldIndex}.wasRemoved`
  const startDateField = `${fieldIndex}.startDate`
  const nationaIdField = `${fieldIndex}.nationalId`
  const nameField = `${fieldIndex}.name`

  useEffect(() => {
    setValue(wasRemovedField, `${repeaterField.wasRemoved || 'false'}`)
    setValue(
      startDateField,
      `${repeaterField.startDate || new Date().toString()}`,
    )
  }, [repeaterField.wasRemoved, repeaterField.startDate, setValue])

  return (
    <Box
      position="relative"
      key={repeaterField.id}
      marginBottom={4}
      hidden={repeaterField.wasRemoved === 'true'}
    >
      <Box display="flex" flexDirection="row" justifyContent="spaceBetween">
        <Text variant="h5">
          {formatMessage(information.labels.operator.operatorTitle)}{' '}
          {rowLocation}
        </Text>
        <Box>
          <Button variant="text" onClick={handleRemove.bind(null, index)}>
            {formatMessage(information.labels.operator.remove)}
          </Button>
        </Box>
      </Box>
      <GridRow>
        <GridColumn span={['1/1', '1/1', '1/2']} paddingTop={2}>
          <InputController
            id={nationaIdField}
            name={nationaIdField}
            label={formatMessage(information.labels.operator.nationalId)}
            defaultValue={repeaterField.nationalId}
            format="######-####"
            backgroundColor="white"
            readOnly
            error={errors && getErrorViaPath(errors, nationaIdField)}
          />
        </GridColumn>
        <GridColumn span={['1/1', '1/1', '1/2']} paddingTop={2}>
          <InputController
            id={nameField}
            name={nameField}
            label={formatMessage(information.labels.operator.name)}
            defaultValue={repeaterField.name}
            backgroundColor="white"
            readOnly
            error={errors && getErrorViaPath(errors, nameField)}
          />
        </GridColumn>
      </GridRow>
    </Box>
  )
}
