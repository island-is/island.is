import React from 'react'
import { Box, Text } from '@island.is/island-ui/core'
import { FAFieldBaseProps, ApproveOptions } from '../../lib/types'
import { useIntl } from 'react-intl'
import { studentForm } from '../../lib/messages'
import { InputController, RadioController } from '@island.is/shared/form-fields'
import { useFormContext } from 'react-hook-form'

const StudentForm = ({ errors, application }: FAFieldBaseProps) => {
  const { formatMessage } = useIntl()
  const { answers } = application

  const typeInput = {
    id: 'student.isStudent',
    error: errors?.student?.isStudent,
  }
  const customInput = {
    id: 'student.custom',
    error: errors?.student?.custom,
  }
  const { clearErrors, getValues } = useFormContext()

  return (
    <>
      <Box marginTop={[2, 2, 3]}>
        <RadioController
          id={typeInput.id}
          defaultValue={answers?.student?.isStudent}
          options={[
            {
              value: ApproveOptions.No,
              label: formatMessage(studentForm.form.no),
            },
            {
              value: ApproveOptions.Yes,
              label: formatMessage(studentForm.form.yes),
            },
          ]}
          largeButtons
          backgroundColor="white"
          error={typeInput.error}
        />
      </Box>
      {getValues(typeInput.id) === ApproveOptions.Yes && (
        <Box>
          <InputController
            id={customInput.id}
            name={customInput.id}
            label={formatMessage(studentForm.input.label)}
            placeholder={formatMessage(studentForm.input.placeholder)}
            backgroundColor="blue"
            error={customInput.error}
            onChange={() => {
              clearErrors(customInput.id)
            }}
          />
          <Text fontWeight="semiBold" variant="small" marginTop={1}>
            {formatMessage(studentForm.input.example)}
          </Text>
        </Box>
      )}
    </>
  )
}

export default StudentForm
