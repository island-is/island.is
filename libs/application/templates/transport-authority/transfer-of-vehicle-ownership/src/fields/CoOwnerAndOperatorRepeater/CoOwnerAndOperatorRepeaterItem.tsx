import { getErrorViaPath, getValueViaPath } from '@island.is/application/core'
import {
  Application,
  FieldBaseProps,
  FormValue,
  RecordObject,
} from '@island.is/application/types'
import { Box, Stack, Text, Button } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { InputController } from '@island.is/shared/form-fields'
import { FC } from 'react'
import { ArrayField } from 'react-hook-form'
import { CoOwnerAndOperatorField } from './CoOwnerAndOperatorRepeater'
import { useFormContext } from 'react-hook-form'
import { NationalIdWithName } from '../NationalIdWithName'
import { information } from '../../lib/messages'

interface Props {
  id: string
  index: number
  rowLocation: number
  repeaterField: Partial<ArrayField<CoOwnerAndOperatorField, 'id'>>
  handleRemove: (index: number) => void
}

export const CoOwnerAndOperatorRepeaterItem: FC<Props & FieldBaseProps> = ({
  id,
  index,
  rowLocation,
  handleRemove,
  repeaterField,
  ...props
}) => {
  const { register } = useFormContext()
  const { formatMessage } = useLocale()
  const { application, errors } = props
  const fieldIndex = `${id}[${index}]`
  const userMessageId = repeaterField.type ?? 'coOwner'
  const emailField = `${fieldIndex}.email`
  const typeField = `${fieldIndex}.type`

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
      />
      <Box marginTop={2}>
        <InputController
          id={emailField}
          name={emailField}
          type="email"
          label={formatMessage(information.labels[userMessageId].email)}
          error={errors && getErrorViaPath(errors, emailField)}
          backgroundColor="blue"
          required
          defaultValue={
            getValueViaPath(application.answers, emailField, '') as string
          }
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
