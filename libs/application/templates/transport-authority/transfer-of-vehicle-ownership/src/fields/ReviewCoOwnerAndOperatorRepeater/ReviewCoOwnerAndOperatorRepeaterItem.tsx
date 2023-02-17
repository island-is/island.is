import { FieldBaseProps } from '@island.is/application/types'
import { Box, Text, Button } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { InputController } from '@island.is/shared/form-fields'
import { FC, useEffect, useState } from 'react'
import { ArrayField } from 'react-hook-form'
import { useFormContext } from 'react-hook-form'
import { NationalIdWithName } from '../NationalIdWithName'
import { information } from '../../lib/messages'
import debounce from 'lodash/debounce'
import { ReviewCoOwnerAndOperatorField } from '../../shared'

const DEBOUNCE_INTERVAL = 300

interface Props {
  id: string
  index: number
  rowLocation: number
  repeaterField: Partial<ArrayField<ReviewCoOwnerAndOperatorField, 'id'>>
  handleRemove: (index: number) => void
  setCoOwnersAndOperators?: (s: ReviewCoOwnerAndOperatorField[]) => void
  coOwnersAndOperators?: ReviewCoOwnerAndOperatorField[]
  errorMessage?: string
}

export const ReviewCoOwnerAndOperatorRepeaterItem: FC<
  Props & FieldBaseProps
> = ({
  id,
  index,
  rowLocation,
  handleRemove,
  repeaterField,
  setCoOwnersAndOperators,
  coOwnersAndOperators,
  errorMessage,
  ...props
}) => {
  const [email, setEmail] = useState<string>(repeaterField.email || '')
  const [phone, setPhone] = useState<string>(repeaterField.phone || '')
  const [nationalId, setNationalId] = useState<string>(
    repeaterField.nationalId || '',
  )
  const [name, setName] = useState<string>(repeaterField.name || '')

  const { setValue, register } = useFormContext()
  const { formatMessage } = useLocale()
  const fieldIndex = `${id}[${index}]`
  const userMessageId = repeaterField.type ?? 'coOwner'
  const emailField = `${fieldIndex}.email`
  const phoneField = `${fieldIndex}.phone`
  const nationalIdField = `${fieldIndex}.nationalId`
  const nameField = `${fieldIndex}.name`
  const typeField = `${fieldIndex}.type`

  useEffect(() => {
    if (setCoOwnersAndOperators && coOwnersAndOperators && index > -1) {
      const temp = [...coOwnersAndOperators]
      const itemValue = {
        email,
        phone,
        nationalId,
        name,
        type: userMessageId,
      }
      temp[index] = itemValue
      setCoOwnersAndOperators(temp)
      setValue(nationalIdField, nationalId)
      setValue(nameField, name)
      setValue(emailField, email)
      setValue(phoneField, phone)
    }
  }, [email, phone, nationalId, name, userMessageId])

  return (
    <Box position="relative" key={repeaterField.id} marginTop={3}>
      <Box display="flex" flexDirection="row" justifyContent="spaceBetween">
        <Text variant="h5">
          {formatMessage(information.labels[userMessageId].title)} {rowLocation}
        </Text>
        <Box>
          <Button variant="text" onClick={handleRemove.bind(null, index)}>
            {formatMessage(information.labels[userMessageId].remove)}
          </Button>
        </Box>
      </Box>
      <NationalIdWithName
        {...props}
        customId={fieldIndex}
        customNameLabel={formatMessage(information.labels[userMessageId].name)}
        customNationalIdLabel={formatMessage(
          information.labels[userMessageId].nationalId,
        )}
        onNationalIdChange={setNationalId}
        nationalIdDefaultValue={nationalId}
        onNameChange={setName}
        nameDefaultValue={name}
        errorMessage={errorMessage}
      />
      <Box marginTop={2}>
        <InputController
          id={emailField}
          name={emailField}
          type="email"
          label={formatMessage(information.labels[userMessageId].email)}
          error={errorMessage && email.length === 0 ? errorMessage : undefined}
          backgroundColor="blue"
          required
          defaultValue={email}
          onChange={debounce(
            (event) => setEmail(event.target.value),
            DEBOUNCE_INTERVAL,
          )}
        />
      </Box>
      <Box marginTop={2}>
        <InputController
          id={phoneField}
          name={phoneField}
          type="tel"
          label={formatMessage(information.labels[userMessageId].phone)}
          error={errorMessage && phone.length === 0 ? errorMessage : undefined}
          backgroundColor="blue"
          required
          defaultValue={phone}
          onChange={debounce(
            (event) => setPhone(event.target.value),
            DEBOUNCE_INTERVAL,
          )}
        />
      </Box>
      <input
        type="hidden"
        value={userMessageId}
        ref={register({ required: true })}
        name={typeField}
      />
    </Box>
  )
}
