import { FC, useState, useEffect } from 'react'
import {
  FieldErrors,
  FieldValues,
  useFormContext,
  Controller,
} from 'react-hook-form'
import { formatText, getErrorViaPath } from '@island.is/application/core'
import { Box, AlertMessage, Checkbox } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { childPensionFormMessage } from '../../lib/messages'
import {
  InputController,
  DatePickerController,
} from '@island.is/shared/form-fields'
import {
  FieldBaseProps,
  FieldTypes,
  FieldComponents,
} from '@island.is/application/types'

import { IdentityInput, Query } from '@island.is/api/schema'
import { useLazyQuery } from '@apollo/client'
import { TextFormField } from '@island.is/application/ui-fields'
import { IDENTITY_QUERY } from '../../graphql/queries'
import subYears from 'date-fns/subYears'
import startOfYear from 'date-fns/startOfYear'
import * as kennitala from 'kennitala'

const RegisterChild: FC<FieldBaseProps> = ({ field, application, errors }) => {
  const { id } = field
  const { setValue, watch } = useFormContext()
  const { formatMessage, lang } = useLocale()
  const [hasError, setHasError] = useState<string | undefined>(undefined)
  const [identityFound, setIdentityFound] = useState(true)
  const [repeaterIndex, setRepeaterIndex] = useState<number>(-1)
  const [childDoesNotHaveNationalId, setChildDoesNotHaveNationalId] =
    useState(false)
  const nameFieldId = `registerChildRepeater[${repeaterIndex}].name`
  const childDoesNotHaveNationalIdFieldId = `registerChildRepeater[${repeaterIndex}].childDoesNotHaveNationalId`
  const nationalIdOrBirthDateFieldId = `registerChildRepeater[${repeaterIndex}].nationalIdOrBirthDate`

  const personNationalId: string = watch(nationalIdOrBirthDateFieldId)

  const nameError = getErrorViaPath(
    errors as FieldErrors<FieldValues>,
    nameFieldId,
  )

  const nationalIdOrBirthDateError = getErrorViaPath(
    errors as FieldErrors<FieldValues>,
    nationalIdOrBirthDateFieldId,
  )

  useEffect(() => {
    const index = id.match(/\d+/g)
    if (index) {
      setRepeaterIndex(Number(index[0]))
    }
  }, [id])

  useEffect(() => {
    setHasError(nationalIdOrBirthDateError)
  }, [nationalIdOrBirthDateError])

  const [getIdentity, { loading: queryLoading, error: queryError }] =
    useLazyQuery<Query, { input: IdentityInput }>(IDENTITY_QUERY, {
      onCompleted: (data) => {
        setValue(nameFieldId, data.identity?.name ?? '')
        setHasError(undefined)
        setIdentityFound(Boolean(data.identity?.name))
      },
      fetchPolicy: 'network-only',
    })

  useEffect(() => {
    const personNationalIdNumbers = personNationalId?.replace(/[^0-9]/g, '')

    if (personNationalIdNumbers?.length === 10) {
      const isValidSSN = kennitala.isPerson(personNationalIdNumbers)
      if (isValidSSN) {
        getIdentity({
          variables: {
            input: {
              nationalId: personNationalIdNumbers,
            },
          },
        })
      }
    } else if (personNationalIdNumbers?.length === 0) {
      setValue(nameFieldId, '')
    }
  }, [personNationalId, getIdentity, id, setValue, nameFieldId])

  const finalMinDate = startOfYear(subYears(new Date(), 17))
  const finalMaxDate = new Date()

  return (
    <>
      <Controller
        name={childDoesNotHaveNationalIdFieldId}
        defaultValue={false}
        render={({ field: { onChange, value } }) => (
          <Box>
            <Checkbox
              id={childDoesNotHaveNationalIdFieldId}
              name={childDoesNotHaveNationalIdFieldId}
              label={formatText(
                childPensionFormMessage.info
                  .registerChildChildDoesNotHaveNationalId,
                application,
                formatMessage,
              )}
              checked={value}
              onChange={(e) => {
                onChange(e.target.checked)
                setValue(childDoesNotHaveNationalIdFieldId, e.target.checked)

                setChildDoesNotHaveNationalId(e.target.checked)
                setValue(nationalIdOrBirthDateFieldId, undefined)
                setHasError(undefined)
                setValue(nameFieldId, '')
                setIdentityFound(true)
              }}
            />
          </Box>
        )}
      />
      {childDoesNotHaveNationalId ? (
        <Box>
          <Box paddingTop={2}>
            <DatePickerController
              id={nationalIdOrBirthDateFieldId}
              locale={lang}
              minDate={finalMinDate}
              maxDate={finalMaxDate}
              backgroundColor="blue"
              label={formatText(
                childPensionFormMessage.info.registerChildBirthDate,
                application,
                formatMessage,
              )}
              placeholder={formatText(
                childPensionFormMessage.info.registerChildBirthDatePlaceholder,
                application,
                formatMessage,
              )}
              error={hasError}
              onChange={(d) => {
                setValue(nationalIdOrBirthDateFieldId as string, d)
              }}
            />
          </Box>
          <Box paddingTop={2}>
            <InputController
              id={nameFieldId}
              label={formatText(
                childPensionFormMessage.info.registerChildFullName,
                application,
                formatMessage,
              )}
              error={nameError}
              onChange={(e) => {
                setValue(nameFieldId as string, e.target.value)
              }}
              backgroundColor="blue"
            />
          </Box>
        </Box>
      ) : (
        <Box paddingTop={2}>
          <InputController
            id={nationalIdOrBirthDateFieldId}
            placeholder="000000-0000"
            label={formatText(
              childPensionFormMessage.info.registerChildNationalId,
              application,
              formatMessage,
            )}
            error={hasError}
            onChange={(e) => {
              setValue(nationalIdOrBirthDateFieldId as string, e.target.value)
            }}
            format="######-####"
            backgroundColor="blue"
            loading={queryLoading}
          />

          <TextFormField
            application={application}
            showFieldName
            field={{
              type: FieldTypes.TEXT,
              title: childPensionFormMessage.info.registerChildFullName,
              id: nameFieldId,
              children: undefined,
              component: FieldComponents.TEXT,
              disabled: true,
            }}
          />
          {((!identityFound && !queryLoading) || queryError) && (
            <Box paddingTop={2}>
              <AlertMessage
                type="warning"
                title={formatMessage(
                  childPensionFormMessage.info.childPensionNameAlertTitle,
                )}
                message={formatMessage(
                  childPensionFormMessage.info.childPensionNameAlertMessage,
                )}
              />
            </Box>
          )}
        </Box>
      )}
    </>
  )
}

export default RegisterChild
