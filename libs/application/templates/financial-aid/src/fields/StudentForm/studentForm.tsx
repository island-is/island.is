import React, { useState } from 'react'
import { Box } from '@island.is/island-ui/core'
import { FAFieldBaseProps, TwoTypeAnswers } from '../../lib/types'
import { useIntl } from 'react-intl'
import { studentForm } from '../../lib/messages'
import { InputController, RadioController } from '@island.is/shared/form-fields'

const StudentForm = ({ errors, application }: FAFieldBaseProps) => {
  const { formatMessage } = useIntl()
  const { answers } = application

  const typeInput = {
    id: 'student.isStudent',
    error: errors?.student?.isStudent,
  }

  const [statefulAnswer, setStatefulAnswer] = useState<
    TwoTypeAnswers | undefined
  >(answers?.student?.isStudent)

  return (
    <>
      <Box marginTop={[2, 2, 3]}>
        <RadioController
          id={typeInput.id}
          defaultValue={statefulAnswer}
          options={[
            {
              value: TwoTypeAnswers.No,
              label: 'Nei',
            },
            {
              value: TwoTypeAnswers.Yes,
              label: 'Já',
            },
          ]}
          onSelect={(newAnswer) =>
            setStatefulAnswer(newAnswer as TwoTypeAnswers)
          }
          largeButtons
          backgroundColor="white"
          error={typeInput.error}
        />
      </Box>
      {statefulAnswer === TwoTypeAnswers.Yes && (
        <Box>
          hér kemur input
          {/* <InputController
            id={`${id}.nationalId`}
            name={`${id}.nationalId`}
            label="Kennitala"
            format="######-####"
          /> */}
        </Box>
      )}
    </>
  )
}

export default StudentForm
