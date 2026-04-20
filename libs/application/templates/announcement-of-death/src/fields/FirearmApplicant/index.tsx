import { useLazyQuery } from '@apollo/client'
import { IdentityInput, Query } from '@island.is/api/schema'
import * as kennitala from 'kennitala'
import { FieldBaseProps } from '@island.is/application/types'
import React, { FC, useEffect } from 'react'
import { FieldErrors, FieldValues, useFormContext } from 'react-hook-form'
import { IDENTITY_QUERY } from '../../graphql'
import { m } from '../../lib/messages'
import { Box, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import { formatText, getErrorViaPath } from '@island.is/application/core'
import { useLocale } from '@island.is/localization'
import {
  InputController,
  PhoneInputController,
} from '@island.is/shared/form-fields'

interface FirearmApplicantBaseProps extends FieldBaseProps {
  errors: FieldErrors<FieldValues>
}

const fieldNames = {
  firearmApplicantNationalId: 'firearmApplicant.nationalId',
  firearmApplicantName: 'firearmApplicant.name',
  firearmApplicantPhone: 'firearmApplicant.phone',
  firearmApplicantEmail: 'firearmApplicant.email',
  lookupError: 'firearmApplicant.lookupError',
}

export const FirearmApplicant: FC<
  React.PropsWithChildren<FirearmApplicantBaseProps>
> = ({ application }) => {
  const { formatMessage } = useLocale()
  const {
    setValue,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useFormContext()

  const [getIdentity, { loading: queryLoading }] = useLazyQuery<
    Query,
    { input: IdentityInput }
  >(IDENTITY_QUERY, {
    onError: (error: unknown) => {
      setError(fieldNames.lookupError, {
        type: 'serverError',
        message: m.errorNationalIdNoName.defaultMessage,
      })
      console.log('getIdentity error:', error)
    },
    onCompleted: (data) => {
      if (data.identity?.name) {
        clearErrors(fieldNames.lookupError)
        clearErrors(fieldNames.firearmApplicantName)
        setValue(fieldNames.firearmApplicantName, data.identity?.name ?? '')
      } else {
        setError(fieldNames.lookupError, {
          type: 'serverError',
          message: m.errorNationalIdNoName.defaultMessage,
        })
      }
    },
  })

  // Clear inital errors on mount
  useEffect(() => {
    clearErrors()
  }, [])

  const nationalId = watch(fieldNames.firearmApplicantNationalId)

  const name = watch(fieldNames.firearmApplicantName)

  useEffect(() => {
    if (nationalId?.length === 10) {
      if (kennitala.isPerson(nationalId)) {
        getIdentity({
          variables: {
            input: {
              nationalId,
            },
          },
        })
      } else if (name !== '') {
        setValue(fieldNames.firearmApplicantNationalId, '')
      }
    } else if (name !== '') {
      setValue(fieldNames.firearmApplicantName, '')
    }
  }, [nationalId, name, getIdentity, setValue])

  return (
    <Box marginTop={3}>
      <Text>
        {formatText(m.firearmsApplicantHeader, application, formatMessage)}
      </Text>
      <GridRow marginBottom={2} marginTop={2}>
        <GridColumn span="6/12">
          <InputController
            id={fieldNames.firearmApplicantNationalId}
            name={fieldNames.firearmApplicantNationalId}
            label={formatText(
              m.firearmsApplicantNationalId,
              application,
              formatMessage,
            )}
            format="######-####"
            defaultValue=""
            backgroundColor="blue"
            icon={name ? 'checkmarkCircle' : undefined}
            loading={queryLoading}
            required
            error={
              getErrorViaPath(errors, 'firearmApplicant.nationalId') ||
              undefined
            }
          />
        </GridColumn>
        <GridColumn span="6/12">
          <InputController
            id={fieldNames.firearmApplicantName}
            name={fieldNames.firearmApplicantName}
            label={formatText(
              m.firearmsApplicantName,
              application,
              formatMessage,
            )}
            readOnly
          />
        </GridColumn>
      </GridRow>
      <GridRow>
        <GridColumn span="6/12">
          <PhoneInputController
            id={fieldNames.firearmApplicantPhone}
            name={fieldNames.firearmApplicantPhone}
            label={formatText(
              m.applicantsPhoneNumber,
              application,
              formatMessage,
            )}
            error={
              getErrorViaPath(errors, 'firearmApplicant.phone') || undefined
            }
            required
          />
        </GridColumn>
        <GridColumn span="6/12">
          <InputController
            id={fieldNames.firearmApplicantEmail}
            name={fieldNames.firearmApplicantEmail}
            label={formatText(m.applicantsEmail, application, formatMessage)}
            error={
              getErrorViaPath(errors, 'firearmApplicant.email') || undefined
            }
            required
          />
        </GridColumn>
      </GridRow>
    </Box>
  )
}
