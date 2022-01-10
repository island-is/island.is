import React from 'react'
import { Box } from '@island.is/island-ui/core'
import { FAFieldBaseProps } from '../../lib/types'
import { useIntl } from 'react-intl'
import { studentForm } from '../../lib/messages'

const StudentForm = ({ errors, application }: FAFieldBaseProps) => {
  const { formatMessage } = useIntl()
  const { answers } = application

  return (
    <>
      <Box>
        {/* <RadioController
          id={`${typeInput.id}`}
          defaultValue={statefulAnswer}
          options={[
            {
              value: ,
              label: ''
            },
          ]}
          onSelect={(newAnswer) =>
            setStatefulAnswer(newAnswer)
          }
          largeButtons
          backgroundColor="white"
          error={typeInput.error}
        /> */}
      </Box>
    </>
  )
}

export default StudentForm
