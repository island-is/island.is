import { gql, useMutation } from '@apollo/client'
import {
  FieldBaseProps,
  formatText,
  getErrorViaPath,
} from '@island.is/application/core'
import { Box, Icon } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { InputController } from '@island.is/shared/form-fields'
import * as Sentry from '@sentry/react'
import cn from 'classnames'
import kennitala from 'kennitala'
import React, { useEffect, useState } from 'react'
import { useDebounce } from 'react-use'
import { employer, error } from '../../lib/messages'
import { PublicDebtPaymentPlan } from '../../types'
import * as styles from './EmployerIdField.css'

const updateCurrentEmployerMutation = gql`
  mutation UpdateCurrentEmployer($input: UpdateCurrentEmployerInput!) {
    updateCurrentEmployer(input: $input) {
      success
    }
  }
`

export const EmployerIdField = ({ application, errors }: FieldBaseProps) => {
  const { formatMessage } = useLocale()
  const [updateCurrentEmployer, { loading, error: updateError }] = useMutation(
    updateCurrentEmployerMutation,
  )
  const answers = application.answers as PublicDebtPaymentPlan
  const [nationalId, setNationalId] = useState<string>(
    answers.employer?.correctedNationalId?.id || '',
  )
  const [debouncedNationalId, setDebouncedNationalId] = useState<string>('')
  const [validNationalId, setValidNationalId] = useState<boolean>(false)

  useDebounce(() => setDebouncedNationalId(nationalId), 500, [nationalId])

  const updateEmployer = async () => {
    const results = await updateCurrentEmployer({
      variables: {
        input: {
          employerNationalId: kennitala.clean(debouncedNationalId),
        },
      },
    })

    if (!results.data) {
      Sentry.captureException(results.errors)
      setValidNationalId(false)
    } else {
      if (results.data?.updateCurrentEmployer?.success) {
        setValidNationalId(true)
      } else {
        setValidNationalId(false)
      }
    }
  }

  useEffect(() => {
    if (
      debouncedNationalId &&
      kennitala.isValid(debouncedNationalId) &&
      kennitala.isCompany(debouncedNationalId)
    ) {
      updateEmployer()
    } else {
      setValidNationalId(false)
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
      {loading && (
        <span
          className={cn(styles.movingIcon, styles.loadingIcon)}
          aria-label="Loading"
        >
          <Icon icon="reload" size="large" color="blue400" />
        </span>
      )}
      {!loading && !validNationalId && updateError && (
        <span className={cn(styles.icon)} aria-label="Loading">
          <Icon icon="close" size="large" color="red400" />
        </span>
      )}
      {!loading && !updateError && validNationalId && (
        <span className={cn(styles.icon)} aria-label="Loading">
          <Icon icon="checkmark" size="large" color="mint400" />
        </span>
      )}
    </Box>
  )
}
