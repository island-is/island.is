import {
  Application,
  formatText,
  FormValue,
  getErrorViaPath,
  RecordObject,
} from '@island.is/application/core'
import { Box, Button, Stack } from '@island.is/island-ui/core'
import { InputController } from '@island.is/shared/form-fields'
import React, { FC } from 'react'
import { useLocale } from '@island.is/localization'
import { informationAboutInstitution } from '../../lib/messages'
import { ArrayField } from 'react-hook-form'
import * as styles from './ContactRepeater.treat'
import { ContactField } from './ContactRepeater'

interface Props {
  id: string
  application: Application
  field: Partial<ArrayField<ContactField, 'id'>>
  answers: FormValue
  index: number
  handleRemoveComplainee: (index: number) => void
  errors: RecordObject<unknown> | undefined
}

export const ContactRepeaterItem: FC<Props> = ({
  id,
  application,
  field,
  index,
  handleRemoveComplainee,
  errors,
}) => {
  const fieldIndex = `${id}[${index}]`
  const nameField = `${fieldIndex}.name`
  const phoneNumberField = `${fieldIndex}.phoneNumber`
  const emailField = `${fieldIndex}.email`

  const { formatMessage } = useLocale()

  return (
    <Box position="relative" key={field.id} marginTop={3}>
      {index > 0 && (
        <Box position="absolute" className={styles.removeFieldButton}>
          <Button
            variant="ghost"
            size="small"
            circle
            icon="remove"
            onClick={handleRemoveComplainee.bind(null, index)}
          />
        </Box>
      )}
      <Stack space={2}>
        <InputController
          id={nameField}
          name={nameField}
          label={formatText(
            informationAboutInstitution.labels.contactName,
            application,
            formatMessage,
          )}
          error={errors && getErrorViaPath(errors, nameField)}
          backgroundColor="blue"
        />
        <InputController
          id={phoneNumberField}
          name={phoneNumberField}
          format="+354 ### #####"
          label={formatText(
            informationAboutInstitution.labels.contactPhoneNumber,
            application,
            formatMessage,
          )}
          error={errors && getErrorViaPath(errors, phoneNumberField)}
          backgroundColor="blue"
        />
        <InputController
          id={emailField}
          name={emailField}
          label={formatText(
            informationAboutInstitution.labels.contactEmail,
            application,
            formatMessage,
          )}
          error={errors && getErrorViaPath(errors, emailField)}
          backgroundColor="blue"
        />
      </Stack>
    </Box>
  )
}
