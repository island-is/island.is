import { formatText, getErrorViaPath } from '@island.is/application/core'
import { Application, RecordObject } from '@island.is/application/types'
import { Box, Button, Stack } from '@island.is/island-ui/core'
import { InputController } from '@island.is/shared/form-fields'
import React, { FC } from 'react'
import { useLocale } from '@island.is/localization'
import { informationAboutInstitution } from '../../lib/messages'
import { FieldArrayWithId } from 'react-hook-form'
import * as styles from './ContactRepeater.css'
import { ContactField } from './ContactRepeater'

interface Props {
  id: string
  application: Application
  field: Partial<FieldArrayWithId<ContactField>>
  index: number
  handleRemoveContact: (index: number) => void
  errors: RecordObject<unknown> | undefined
}

export const ContactRepeaterItem: FC<React.PropsWithChildren<Props>> = ({
  id,
  application,
  field,
  index,
  handleRemoveContact,
  errors,
}) => {
  const fieldIndex = `${id}[${index}]`
  const nameField = `${fieldIndex}.name`
  const phoneNumberField = `${fieldIndex}.phoneNumber`
  const emailField = `${fieldIndex}.email`

  const { formatMessage } = useLocale()

  return (
    <Box position="relative" key={field.id} marginTop={3} marginBottom={5}>
      {index > 0 && (
        <Box position="absolute" className={styles.removeFieldButton}>
          <Button
            variant="ghost"
            size="small"
            circle
            icon="remove"
            onClick={() => {
              handleRemoveContact(index)
            }}
          />
        </Box>
      )}
      <Stack space={2}>
        <InputController
          id={nameField}
          name={nameField}
          required={true}
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
          required={true}
          type={'tel'}
          format="### ####"
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
          type={'email'}
          required={true}
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
