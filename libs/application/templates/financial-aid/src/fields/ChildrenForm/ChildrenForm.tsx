import React from 'react'
import { Text, Box } from '@island.is/island-ui/core'
import { childrenForm } from '../../lib/messages'
import { sortChildrenUnderAgeByAge } from '../../lib/utils'
import { useFormContext } from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import format from 'date-fns/format'
import { InputController } from '@island.is/shared/form-fields'
import { getErrorViaPath } from '@island.is/application/core'
import kennitala from 'kennitala'
import { ApplicantChildCustodyInformation } from 'libs/application/types/src/lib/template-api/shared-api/models'
import { FieldBaseProps } from '@island.is/application/types'

const ChildrenForm = ({ application, field, errors }: FieldBaseProps) => {
  const { setValue, clearErrors } = useFormContext()
  const { formatMessage } = useLocale()

  const { externalData } = application
  const childrenExternalData = externalData.childrenCustodyInformation
    .data as ApplicantChildCustodyInformation[]
  const childrenInfo = sortChildrenUnderAgeByAge(childrenExternalData)

  return (
    <>
      {childrenInfo?.map((child, index) => {
        const fieldIndex = `${field.id}[${index}]`

        setValue(`${fieldIndex}.livesWithApplicant`, child.livesWithApplicant)
        setValue(
          `${fieldIndex}.livesWithBothParents`,
          child.livesWithBothParents,
        )

        const schoolField = `${fieldIndex}.school`
        const nameField = `${fieldIndex}.fullName`
        const nationalIdField = `${fieldIndex}.nationalId`

        setValue(nameField, child.fullName)
        setValue(nationalIdField, child.nationalId)

        const kennitalaInfo = kennitala.info(child.nationalId)
        const birthday = new Date(kennitalaInfo?.birthday)

        return (
          <Box marginBottom={5} key={child.nationalId}>
            <Text variant="h3" fontWeight="semiBold" marginBottom={1}>
              {child.fullName}
            </Text>
            <Text variant="small">
              {formatMessage(childrenForm.page.birthday, {
                birthday: format(birthday, 'dd.MM.yyyy'),
              })}
            </Text>

            <Box marginTop={[2, 2, 3]}>
              <InputController
                id={schoolField}
                name={schoolField}
                required={true}
                placeholder={formatMessage(
                  childrenForm.inputs.schoolPlaceholder,
                )}
                label={formatMessage(childrenForm.inputs.schoolLabel)}
                error={errors && getErrorViaPath(errors, schoolField)}
                backgroundColor="blue"
                onChange={() => {
                  clearErrors(schoolField)
                }}
              />
            </Box>
          </Box>
        )
      })}
    </>
  )
}

export default ChildrenForm
