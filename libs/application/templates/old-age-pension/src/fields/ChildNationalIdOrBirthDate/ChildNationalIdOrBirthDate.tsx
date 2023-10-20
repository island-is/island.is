import { FC, useState, useEffect } from 'react'
import { FieldErrors, FieldValues, useFormContext } from 'react-hook-form'
import { formatText, getErrorViaPath } from '@island.is/application/core'
import { Box, AlertMessage } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { oldAgePensionFormMessage } from '../../lib/messages'
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
import * as kennitala from 'kennitala'
import { getApplicationAnswers } from '../../lib/oldAgePensionUtils'

const ChildNationalIdOrBirthDate: FC<FieldBaseProps> = ({
  error,
  field,
  application,
  errors,
}) => {
  const { id } = field
  const { setValue, watch } = useFormContext()
  const { formatMessage, lang } = useLocale()
  const [hasError, setHasError] = useState(error)
  const [identityFound, setIdentityFound] = useState(true)
  const [repeaterIndex, setRepeaterIndex] = useState<number>(-1)
  const [childDoesNotHaveNationalId, setChildDoesNotHaveNationalId] =
    useState(false)
  const personNationalId: string = watch(`${id}`)
  const watchChildDoesNotHaveNationalIdField: boolean = watch(
    `childPensionRepeater[${repeaterIndex}].childDoesNotHaveNationalId`,
    false,
  )
  const nameFieldId = `childPensionRepeater[${repeaterIndex}].name`

  const nameError = getErrorViaPath(
    errors as FieldErrors<FieldValues>,
    nameFieldId,
  )

  useEffect(() => {
    const index = id.match(/\d+/g)
    if (index) {
      setRepeaterIndex(Number(index[0]))
    }
  }, [id])

  useEffect(() => {
    setHasError(error)
  }, [error])

  useEffect(() => {
    setChildDoesNotHaveNationalId(watchChildDoesNotHaveNationalIdField)
    setValue(id, undefined)
    setHasError(undefined)
    setValue(nameFieldId, '')
    setIdentityFound(true)
  }, [watchChildDoesNotHaveNationalIdField, id, setValue, nameFieldId])

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

  const { selectedYear, selectedMonth } = getApplicationAnswers(
    application.answers
  )
  const pensionPeriod = new Date(selectedYear + selectedMonth)
  const finalMinDate = new Date(pensionPeriod.setFullYear(pensionPeriod.getFullYear() - 18))
  const finalMaxDate = new Date()

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {childDoesNotHaveNationalId ? (
        <Box>
          <Box paddingTop={2}>
            <DatePickerController
              id={id}
              locale={lang}
              minDate={finalMinDate}
              maxDate={finalMaxDate}
              backgroundColor="blue"
              label={formatText(
                oldAgePensionFormMessage.connectedApplications
                  .childPensionBirthDate,
                application,
                formatMessage,
              )}
              placeholder={formatText(
                oldAgePensionFormMessage.connectedApplications
                  .childPensionBirthDatePlaceholder,
                application,
                formatMessage,
              )}
              error={hasError}
              onChange={(d) => {
                setValue(id as string, d)
              }}
            />
          </Box>
          <Box paddingTop={2}>
            <InputController
              id={nameFieldId}
              label={formatText(
                oldAgePensionFormMessage.connectedApplications
                  .childPensionFullName,
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
            id={id}
            placeholder="000000-0000"
            label={formatText(
              oldAgePensionFormMessage.connectedApplications
                .childPensionNationalId,
              application,
              formatMessage,
            )}
            error={hasError}
            onChange={(e) => {
              setValue(id as string, e.target.value)
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
              title:
                oldAgePensionFormMessage.connectedApplications
                  .childPensionFullName,
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
                  oldAgePensionFormMessage.connectedApplications
                    .childPensionNameAlertTitle,
                )}
                message={formatMessage(
                  oldAgePensionFormMessage.connectedApplications
                    .childPensionNameAlertMessage,
                )}
              />
            </Box>
          )}
        </Box>
      )}
    </>
  )
}

export default ChildNationalIdOrBirthDate
