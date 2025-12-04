import React, { FC, useEffect, useState } from 'react'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { PhoneInputController } from '@island.is/shared/form-fields'
import { Box, AlertMessage } from '@island.is/island-ui/core'
import { FieldBaseProps } from '@island.is/application/types'
import { getErrorViaPath } from '@island.is/application/core'
import { useLazyQuery } from '@apollo/client'
import { useFormContext } from 'react-hook-form'
import { fakeDataIsEnabled } from '../../lib/utils'
import { GET_SYSLUMENN_ELECTRONIC_ID_STATUS } from '../../queries'

interface PhoneWithElectronicIdProps {
  field: {
    props: { nationalIdPath: string }
  }
}

export const PhoneWithElectronicId: FC<
  React.PropsWithChildren<FieldBaseProps & PhoneWithElectronicIdProps>
> = ({ application: { answers }, field, errors }) => {
  const { formatMessage } = useLocale()
  const { id } = field
  const { nationalIdPath } = field.props
  const { watch, setValue } = useFormContext()
  const nationalId: string = watch(nationalIdPath)
  const [loading, setLoading] = useState(false)
  const [checkResult, setCheckResult] = useState<'success' | 'failure' | null>(
    null,
  )

  const [getElectronicIdStatus] = useLazyQuery(
    GET_SYSLUMENN_ELECTRONIC_ID_STATUS,
  )
  const topId = id.split('.')[0]

  useEffect(() => {
    // Reset check result when nationalId changes
    setCheckResult(null)

    if (nationalId?.length === 10) {
      setLoading(true)

      if (fakeDataIsEnabled(answers)) {
        // For fake data: Always pass electronic ID check to avoid blocking testers
        // Testers use specific test kennitölur that need to work for lookup
        setValue(`${topId}.electronicID`, 'true')
        setCheckResult('success')
        setLoading(false)
        return
      }

      // Check if user has ANY type of electronic ID (eSIM, app, or card)
      getElectronicIdStatus({
        variables: {
          input: {
            nationalId,
          },
        },
      })
        .then((res) => {
          if (!res.data?.getSyslumennElectronicIDStatus) {
            setValue(`${topId}.electronicID`, '')
            setCheckResult('failure')
          } else {
            setValue(`${topId}.electronicID`, 'true')
            setCheckResult('success')
          }
          setLoading(false)
        })
        .catch((error) => {
          // On error, treat as no electronic ID and allow validation to show error
          console.error('Electronic ID check failed:', error)
          setValue(`${topId}.electronicID`, '')
          setCheckResult('failure')
          setLoading(false)
        })
    }
  }, [nationalId, getElectronicIdStatus, answers, setValue, topId])

  return (
    <Box marginTop={2}>
      <PhoneInputController
        id={id}
        label={formatMessage(m.phone)}
        backgroundColor="blue"
        required
        disableDropdown
        loading={loading}
        error={errors ? getErrorViaPath(errors, id) : undefined}
        defaultValue=""
      />
      {loading && (
        <Box marginTop={2}>
          <AlertMessage
            type="info"
            message={formatMessage(m.electronicIdCheckLoading)}
          />
        </Box>
      )}
      {!loading && checkResult === 'success' && (
        <Box marginTop={2}>
          <AlertMessage
            type="success"
            message={formatMessage(m.electronicIdCheckSuccess)}
          />
        </Box>
      )}
      {!loading && checkResult === 'failure' && (
        <Box marginTop={2}>
          <AlertMessage
            type="warning"
            message={formatMessage(m.electronicIdCheckFailure)}
          />
        </Box>
      )}
    </Box>
  )
}
