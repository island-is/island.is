import React, { useCallback, useEffect, useState } from 'react'
import {
  FieldBaseProps,
  formatText,
  getErrorViaPath,
  getValueViaPath,
} from '@island.is/application/core'
import { Box, Text } from '@island.is/island-ui/core'
import { InputController } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { employer } from '../../lib/messages'
import debounce from 'lodash/debounce'

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const EmployerIdField = ({ application, errors }: FieldBaseProps) => {
  const { formatMessage } = useLocale()
  const initValue = getValueViaPath(
    application.answers,
    'employer.correctedNationalId',
  ) as string
  const [value, setValue] = useState(initValue || '')
  const [company, setCompany] = useState<string | null>(null)

  const updateQuery = async () => {
    await sleep(500)
    if (value.length > 3)
      setCompany(company === 'Krónan ehf.' ? 'Hagkaup' : 'Krónan ehf.')
    else setCompany(null)
  }
  const debounceValue = useCallback(debounce(updateQuery, 500), [value])

  useEffect(() => {
    debounceValue()
    return debounceValue.cancel
  }, [value, debounceValue])

  const handleNationalIdChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { value } = e.target
    setValue(value)
  }

  return (
    <Box>
      <Text marginTop={2} marginBottom={3}>
        {formatText(
          employer.labels.employerNationalIdLabel,
          application,
          formatMessage,
        )}
      </Text>
      <InputController
        id="employer.correctedNationalId"
        name="employer.correctedNationalId"
        label={formatText(
          employer.labels.employerNationalId,
          application,
          formatMessage,
        )}
        error={
          errors && getErrorViaPath(errors, 'employer.correctedNationalId')
        }
        backgroundColor="blue"
        required
        format="######-####"
        onChange={handleNationalIdChange}
      />
      {company && (
        <Text variant="h2" marginTop={3}>
          {company}
        </Text>
      )}
    </Box>
  )
}
