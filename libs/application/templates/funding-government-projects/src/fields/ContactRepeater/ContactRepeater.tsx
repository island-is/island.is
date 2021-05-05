import { FieldBaseProps } from '@island.is/application/core'
import { Box, Button, Text } from '@island.is/island-ui/core'
import React, { FC, useEffect } from 'react'
import { useLocale } from '@island.is/localization'
import { informationAboutInstitution } from '../../lib/messages'
import { useFieldArray } from 'react-hook-form'
import { ContactRepeaterItem } from './ContactRepeaterItem'

export type ContactField = {
  name: string
  phoneNumber: string
  email: string
}

export const ContactRepeater: FC<FieldBaseProps> = ({
  application,
  field,
  errors,
}) => {
  const { formatMessage } = useLocale()
  const { answers } = application
  const { id } = field
  const { fields, append, remove } = useFieldArray<ContactField>({
    name: id,
  })

  useEffect(() => {
    // The repeater should include one line by default
    if (fields.length === 0) handleAddContact()
  }, [fields])

  const handleAddContact = () =>
    append({
      name: '',
      phoneNumber: '',
      email: '',
    })
  const handleRemoveContact = (index: number) => remove(index)

  return (
    <Box marginTop={6}>
      <Text variant="h5">
        {formatMessage(
          informationAboutInstitution.labels.informationAboutContact,
        )}
      </Text>
      <Text>
        {formatMessage(
          informationAboutInstitution.labels.informationAboutContactDescription,
        )}
      </Text>

      {fields.map((field, index) => {
        return (
          <ContactRepeaterItem
            id={id}
            application={application}
            answers={answers}
            field={field}
            index={index}
            key={field.id}
            handleRemoveContact={handleRemoveContact}
            errors={errors}
          />
        )
      })}
      <Text marginY={3}>
        {formatMessage(informationAboutInstitution.labels.contactAddPerson)}
      </Text>
      <Button
        variant="ghost"
        icon="add"
        iconType="outline"
        size="small"
        onClick={handleAddContact}
      >
        {formatMessage(informationAboutInstitution.labels.contactAddPerson)}
      </Button>
    </Box>
  )
}
