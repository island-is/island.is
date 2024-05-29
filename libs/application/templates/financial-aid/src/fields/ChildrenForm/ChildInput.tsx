import React, { FC } from 'react'

import { Text, Box } from '@island.is/island-ui/core'

import { childrenForm } from '../../lib/messages'
import format from 'date-fns/format'

import { InputController } from '@island.is/shared/form-fields'

import kennitala from 'kennitala'
import { useLocale } from '@island.is/localization'
import { RecordObject } from '@island.is/application/types'
import { getErrorViaPath } from '@island.is/application/core'
import { useFormContext } from 'react-hook-form'

interface Props {
  fieldIndex: string
  errors: RecordObject<unknown> | undefined
  childFullName: string
  childNationalId: string
}

export const ChildInput: FC<React.PropsWithChildren<Props>> = ({
  fieldIndex,
  errors,
  childFullName,
  childNationalId,
}) => {
  const { setValue, clearErrors } = useFormContext()

  const schoolField = `${fieldIndex}.school`
  const nameField = `${fieldIndex}.fullName`
  const nationalIdField = `${fieldIndex}.nationalId`

  setValue(nameField, childFullName)
  setValue(nationalIdField, childNationalId)

  const nationalId = childNationalId
  const kennitalaInfo = kennitala.info(nationalId)
  const birthday = kennitalaInfo?.birthday
  const age = kennitalaInfo?.age
  const dateOfBirth = new Date(birthday)

  const { formatMessage } = useLocale()

  if (age >= 18) {
    return null
  }
  return (
    <Box
      marginBottom={5}
      background="blue100"
      padding={3}
      borderRadius="standard"
      key={childNationalId}
    >
      <Text variant="h3" fontWeight="semiBold" marginBottom={1}>
        {childFullName}
      </Text>
      <Text variant="small">
        {formatMessage(childrenForm.page.birthday, {
          birthday: format(dateOfBirth, 'dd.MM.yyyy'),
        })}
      </Text>

      <Box marginTop={[2, 2, 3]}>
        <InputController
          id={schoolField}
          name={schoolField}
          required={true}
          placeholder={formatMessage(childrenForm.inputs.schoolPlaceholder)}
          label={formatMessage(childrenForm.inputs.schoolLabel)}
          error={errors && getErrorViaPath(errors, schoolField)}
          backgroundColor="white"
          onChange={() => {
            clearErrors(schoolField)
          }}
        />
      </Box>
    </Box>
  )
}
