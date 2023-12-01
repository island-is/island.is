import { FieldBaseProps, GenericFormField } from '@island.is/application/types'
import {
  Box,
  Text,
  Button,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { InputController } from '@island.is/shared/form-fields'
import { FC, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { NationalIdWithName } from '../NationalIdWithName'
import { information } from '../../lib/messages'
import debounce from 'lodash/debounce'
import { Operator } from '../../shared'

const DEBOUNCE_INTERVAL = 300

interface Props {
  id: string
  index: number
  repeaterField: GenericFormField<Operator>
  handleRemove: (index: number) => void
  setBuyerOperator?: (s: Operator) => void
  buyerOperator?: Operator
  errorMessage?: string
}

export const ReviewOperatorRepeaterItem: FC<
  React.PropsWithChildren<Props & FieldBaseProps>
> = ({
  id,
  index,
  handleRemove,
  repeaterField,
  setBuyerOperator,
  buyerOperator,
  errorMessage,
  ...props
}) => {
  const [email, setEmail] = useState<string>(repeaterField.email || '')
  const [phone, setPhone] = useState<string>(repeaterField.phone || '')
  const [nationalId, setNationalId] = useState<string>(
    repeaterField.nationalId || '',
  )
  const [name, setName] = useState<string>(repeaterField.name || '')

  const { setValue } = useFormContext()
  const { formatMessage } = useLocale()
  const fieldIndex = `${id}[${index}]`
  const emailField = `${fieldIndex}.email`
  const phoneField = `${fieldIndex}.phone`
  const nationalIdField = `${fieldIndex}.nationalId`
  const nameField = `${fieldIndex}.name`
  const wasRemovedField = `${fieldIndex}.wasRemoved`

  useEffect(() => {
    if (setBuyerOperator && buyerOperator && index > -1) {
      const temp = buyerOperator
      const itemValue = {
        email,
        phone,
        nationalId,
        name,
        wasRemoved: repeaterField.wasRemoved,
      }
      setBuyerOperator(temp)
      setValue(nationalIdField, nationalId)
      setValue(nameField, name)
      setValue(emailField, email)
      setValue(phoneField, phone)
      setValue(wasRemovedField, repeaterField.wasRemoved)
    }
  }, [email, phone, nationalId, name])

  return (
    <Box
      position="relative"
      hidden={repeaterField.wasRemoved === 'true'}
      marginTop={3}
    >
      <Box display="flex" flexDirection="row" justifyContent="spaceBetween">
        <Text variant="h5">
          {formatMessage(information.labels.operator.title)}
        </Text>
        <Box>
          <Button variant="text" onClick={handleRemove.bind(null, index)}>
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
        onNationalIdChange={setNationalId}
        nationalIdDefaultValue={nationalId}
        onNameChange={setName}
        nameDefaultValue={name}
        errorMessage={errorMessage}
        disabled={repeaterField.approved}
      />
      <GridRow>
        <GridColumn span={['1/1', '1/1', '1/2']} paddingTop={2}>
          <InputController
            id={emailField}
            name={emailField}
            type="email"
            label={formatMessage(information.labels.operator.email)}
            error={
              errorMessage && email.length === 0 ? errorMessage : undefined
            }
            backgroundColor="blue"
            required
            defaultValue={email}
            onChange={debounce(
              (event) => setEmail(event.target.value),
              DEBOUNCE_INTERVAL,
            )}
          />
        </GridColumn>
        <GridColumn span={['1/1', '1/1', '1/2']} paddingTop={2}>
          <InputController
            id={phoneField}
            name={phoneField}
            type="tel"
            format="###-####"
            label={formatMessage(information.labels.operator.phone)}
            error={
              errorMessage && phone.length === 0 ? errorMessage : undefined
            }
            backgroundColor="blue"
            required
            defaultValue={phone}
            onChange={debounce(
              (event) => setPhone(event.target.value),
              DEBOUNCE_INTERVAL,
            )}
          />
        </GridColumn>
      </GridRow>
    </Box>
  )
}
