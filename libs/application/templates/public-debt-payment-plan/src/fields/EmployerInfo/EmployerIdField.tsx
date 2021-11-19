import { gql, useMutation } from '@apollo/client'
import {
  FieldBaseProps,
  formatText,
  getErrorViaPath,
} from '@island.is/application/core'
import { Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { InputController } from '@island.is/shared/form-fields'
import kennitala from 'kennitala'
import React, { useEffect, useState } from 'react'
import { useDebounce } from 'react-use'
import { employer, error } from '../../lib/messages'
import { PublicDebtPaymentPlan } from '../../types'

const updateCurrentEmployerMutation = gql`
  mutation UpdateCurrentEmployer($input: UpdateCurrentEmployerInput!) {
    updateCurrentEmployer(input: $input) {
      success
    }
  }
`

export const EmployerIdField = ({ application, errors }: FieldBaseProps) => {
  const { formatMessage } = useLocale()
  const [updateCurrentEmployer] = useMutation(updateCurrentEmployerMutation)
  const answers = application.answers as PublicDebtPaymentPlan
  const [nationalId, setNationalId] = useState<string>(
    answers.employer?.correctedNationalId?.id || '',
  )
  const [debouncedNationalId, setDebouncedNationalId] = useState<string>('')

  useDebounce(() => setDebouncedNationalId(nationalId), 500, [nationalId])

  const updateEmployer = async () => {
    const results = await updateCurrentEmployer({
      variables: {
        input: {
          employerNationalId: debouncedNationalId,
        },
      },
    })

    console.log(results)

    if (!results.data) {
      console.log('got an error')
      // error
    }
  }

  useEffect(() => {
    console.log(debouncedNationalId)
    if (
      debouncedNationalId &&
      kennitala.isValid(debouncedNationalId) &&
      kennitala.isCompany(debouncedNationalId)
    ) {
      // something
      console.log('we got debounced baby boo')
      updateEmployer()
    } else {
      // something else
      console.log('whats goin on baby boo :O')
    }
  }, [debouncedNationalId])

  return (
    <Box marginTop={5}>
      <InputController
        id="employer.correctedNationalId.id"
        name="employer.correctedNationalId.id"
        label={formatText(
          employer.labels.employerNationalId,
          application,
          formatMessage,
        )}
        placeholder={formatText(
          employer.labels.employerNationalIdPlaceholder,
          application,
          formatMessage,
        )}
        error={
          errors &&
          getErrorViaPath(errors, 'employer.correctedNationalId') &&
          formatMessage(error.nationalId)
        }
        backgroundColor="blue"
        required
        format="######-####"
        defaultValue={nationalId}
        onChange={(value) => setNationalId(value.target.value)}
      />
    </Box>
  )
}
