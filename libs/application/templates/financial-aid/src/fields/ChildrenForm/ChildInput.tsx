import React, { FC } from 'react'

import { Text, Box } from '@island.is/island-ui/core'

import { childrenForm } from '../../lib/messages'
import format from 'date-fns/format'

import {
  CheckboxController,
  InputController,
} from '@island.is/shared/form-fields'

import kennitala from 'kennitala'
import { getMessageForSchool } from '../../lib/formatters'
import { getSchoolType } from '../../lib/utils'
import { useLocale } from '@island.is/localization'
import { RecordObject } from '@island.is/application/types'
import { getErrorViaPath } from '@island.is/application/core'
import { useFormContext } from 'react-hook-form'

interface Props {
  id: string
  index: number
  errors: RecordObject<unknown> | undefined
  childFullName: string
  childNationalId: string
}

export const ChildInput: FC<React.PropsWithChildren<Props>> = ({
  id,
  index,
  errors,
  childFullName,
  childNationalId,
}) => {
  const { setValue, clearErrors } = useFormContext()

  const fieldIndex = `${id}[${index}]`
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

  const schoolType = getSchoolType(age)

  const { formatMessage } = useLocale()

  if (!schoolType) {
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
          placeholder={formatMessage(
            getMessageForSchool[schoolType].placeholder,
          )}
          label={formatMessage(getMessageForSchool[schoolType].label)}
          error={errors && getErrorViaPath(errors, schoolField)}
          backgroundColor="white"
          onChange={() => {
            clearErrors(schoolField)
          }}
        />
      </Box>

      {/* {schoolType === SchoolType.ELEMENTARY && (
        <>
          <Box
            background="white"
            borderRadius="standard"
            marginBottom={[1]}
            marginTop={[3]}
          >
            <CheckboxController
              id={hasFoodStampsField}
              name={hasFoodStampsField}
              large={true}
              spacing={0}
              options={[
                {
                  value: 'yes',
                  label: formatMessage(
                    childrenForm.inputs.elementarySchoolFoodCheck,
                  ),
                },
              ]}
            />
          </Box>
          <Box background="white" borderRadius="standard" marginBottom={[1]}>
            <CheckboxController
              id={hasAfterSchool}
              name={hasAfterSchool}
              large={true}
              spacing={0}
              options={[
                {
                  value: 'yes',
                  label: formatMessage(
                    childrenForm.inputs.elementarySchoolAfterSchoolCheck,
                  ),
                },
              ]}
            />
          </Box>
        </>
      )}
      {schoolType === SchoolType.HIGHSCHOOL && (
        <Box background="white" borderRadius="standard" marginBottom={[1]}>
          <CheckboxController
            id={hasBookAid}
            name={hasBookAid}
            large={true}
            spacing={0}
            options={[
              {
                value: 'yes',
                label: formatMessage(
                  childrenForm.inputs.elementarySchoolFoodCheck,
                ),
              },
            ]}
          />
        </Box>
      )} */}
    </Box>
  )
}
