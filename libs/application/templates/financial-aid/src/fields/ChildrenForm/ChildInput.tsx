import React, { FC } from 'react'

import { Text, Box } from '@island.is/island-ui/core'

import { DescriptionText } from '..'
import { FAApplication, FAFieldBaseProps, SchoolType } from '../../lib/types'
import withLogo from '../Logo/Logo'
import { childrenForm } from '../../lib/messages'
import format from 'date-fns/format'

import {
  CheckboxController,
  InputController,
} from '@island.is/shared/form-fields'

import { sortChildrenByAge } from '@island.is/application/templates/family-matters-core/utils'
import kennitala from 'kennitala'
import { getMessageForSchool } from '../../lib/formatters'
import { getSchoolType } from '../../lib/utils'
import { FieldArrayWithId, useFormContext } from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import { RecordObject } from '@island.is/application/types'
import { ChildrenField } from './ChildrenForm'
import { formatText, getErrorViaPath } from '@island.is/application/core'
export const CHILDREN_INDEX = '{childrenIndex}'

const childrenTypes = (CHILDREN_INDEX: number) => {
  return {
    nationalId: `children[${CHILDREN_INDEX}].nationalId`,
    school: `children[${CHILDREN_INDEX}].school`,
    hasFoodStamps: `children[${CHILDREN_INDEX}].hasFoodStamps`,
    hasAfterSchool: `children[${CHILDREN_INDEX}].hasAfterSchool`,
    hasBookAid: `children[${CHILDREN_INDEX}].hasBookAid`,
  }
}

interface Props {
  id: string
  application: FAApplication
  field: Partial<FieldArrayWithId<ChildrenField>>
  index: number
  handleRemoveContact: (index: number) => void
  errors: RecordObject<unknown> | undefined
  childFullName: string
  childNationalId: string
}

export const ChildInput: FC<React.PropsWithChildren<Props>> = ({
  id,
  application,
  field,
  index,
  handleRemoveContact,
  errors,
  childFullName,
  childNationalId,
}) => {
  const fieldIndex = `${id}[${index}]`
  const nationalIdField = `${fieldIndex}.nationalId`
  const schoolField = `${fieldIndex}.school`
  const hasFoodStampsField = `${fieldIndex}.hasFoodStamps`
  const hasAfterSchool = `${fieldIndex}.hasAfterSchool`
  const hasBookAid = `${fieldIndex}.hasBookAid`

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
  console.log(schoolField)

  return (
    <Box
      marginBottom={5}
      background="blue100"
      padding={3}
      borderRadius="standard"
      key={field.id}
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
          label={formatMessage(getMessageForSchool[schoolType].label)}
          error={errors && getErrorViaPath(errors, schoolField)}
          backgroundColor="blue"
        />
        {/* <InputController
          id={childrenTypes(index).school}
          name={childrenTypes(index).school}
          type="text"
          placeholder={formatMessage(
            getMessageForSchool[schoolType].placeholder,
          )}
          required={true}
          label={formatMessage(getMessageForSchool[schoolType].label)}
          defaultValue={answers?.children[index].school || ''}
        /> */}
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
                id={childrenTypes(index).hasFoodStamps}
                name={childrenTypes(index).hasFoodStamps}
                defaultValue={
                  answers?.children
                    ? [answers?.children[index].hasFoodStamps]
                    : []
                }
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
                id={childrenTypes(index).hasAfterSchool}
                name={childrenTypes(index).hasAfterSchool}
                defaultValue={
                  answers.children
                    ? [answers.children[index].hasAfterSchool]
                    : []
                }
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
              id={childrenTypes(index).hasBookAid}
              name={childrenTypes(index).hasBookAid}
              defaultValue={
                answers.children ? [answers.children[index].hasAfterSchool] : []
              }
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
