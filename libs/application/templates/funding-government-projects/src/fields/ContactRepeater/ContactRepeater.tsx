import { FieldBaseProps } from '@island.is/application/types'
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

export const ContactRepeater: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
  field,
  errors,
}) => {
  const { formatMessage } = useLocale()
  const { id } = field
  const { fields, append, remove } = useFieldArray({
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
    <Box marginTop={[5, 6]}>
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
            field={field}
            index={index}
            key={field.id}
            handleRemoveContact={handleRemoveContact}
            errors={errors}
          />
        )
      })}
      {fields.length < 2 && (
        <Box marginY={3}>
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
      )}
    </Box>
  )
}
