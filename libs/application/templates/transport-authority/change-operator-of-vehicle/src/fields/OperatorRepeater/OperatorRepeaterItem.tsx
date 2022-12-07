import { getErrorViaPath, getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import {
  Box,
  Text,
  Button,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { InputController } from '@island.is/shared/form-fields'
import { FC } from 'react'
import { ArrayField, useFormContext } from 'react-hook-form'
import { NationalIdWithName } from '../NationalIdWithName'
import { information } from '../../lib/messages'
import { OperatorInformation } from '../../shared'

interface Props {
  id: string
  index: number
  rowLocation: number
  repeaterField: Partial<ArrayField<OperatorInformation, 'id'>>
  handleRemove: (index: number, wasAdded?: boolean) => void
}

export const OperatorRepeaterItem: FC<Props & FieldBaseProps> = ({
  id,
  index,
  rowLocation,
  handleRemove,
  repeaterField,
  ...props
}) => {
  const { formatMessage } = useLocale()
  const { register } = useFormContext()
  const { application, errors } = props
  const fieldIndex = `${id}[${index}]`
  const emailField = `${fieldIndex}.email`
  const phoneField = `${fieldIndex}.phone`
  const wasAddedField = `${fieldIndex}.wasAdded`

  return (
    <Box position="relative" key={repeaterField.id} marginBottom={4}>
      <Box display="flex" flexDirection="row" justifyContent="spaceBetween">
        <Text variant="h5">
          {formatMessage(information.labels.operator.operatorTitle)}{' '}
          {rowLocation}
        </Text>
        <Box>
          <Button
            variant="text"
            onClick={handleRemove.bind(null, index, repeaterField.wasAdded)}
          >
            {formatMessage(information.labels.operator.remove)}
          </Button>
        </Box>
      </Box>
      <NationalIdWithName
        {...props}
        customId={fieldIndex}
        customNameLabel={formatMessage(information.labels.operator.name)}
        customNationalIdLabel={formatMessage(
          information.labels.operator.nationalId,
        )}
      />
      <GridRow>
        <GridColumn span={['1/1', '1/1', '1/2']} paddingTop={2}>
          <InputController
            id={emailField}
            name={emailField}
            type="email"
            label={formatMessage(information.labels.operator.email)}
            error={errors && getErrorViaPath(errors, emailField)}
            backgroundColor="blue"
            required
            defaultValue={
              getValueViaPath(application.answers, emailField, '') as string
            }
          />
        </GridColumn>
        <GridColumn span={['1/1', '1/1', '1/2']} paddingTop={2}>
          <InputController
            id={phoneField}
            name={phoneField}
            type="tel"
            label={formatMessage(information.labels.operator.phone)}
            error={errors && getErrorViaPath(errors, phoneField)}
            backgroundColor="blue"
            required
            defaultValue={
              getValueViaPath(application.answers, phoneField, '') as string
            }
          />
        </GridColumn>
        <input
          type="hidden"
          value={`${repeaterField.wasAdded}`}
          ref={register({ required: true })}
          name={wasAddedField}
        />
      </GridRow>
    </Box>
  )
}
