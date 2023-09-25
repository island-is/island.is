import { FC, useState, useEffect } from 'react'
import {
  FieldErrors,
  FieldValues,
  useFormContext,
  Controller,
} from 'react-hook-form'
import { formatText, getErrorViaPath } from '@island.is/application/core'
import {
  Box,
  AlertMessage,
  Checkbox,
  GridRow,
  GridColumn,
  Text,
  Button,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { childPensionFormMessage } from '../../../lib/messages'
import {
  InputController,
  DatePickerController,
} from '@island.is/shared/form-fields'
import { Application, RecordObject } from '@island.is/application/types'
import { IdentityInput, Query } from '@island.is/api/schema'
import { useLazyQuery } from '@apollo/client'
import { IDENTITY_QUERY } from '../../../graphql/queries'
import * as kennitala from 'kennitala'

interface ParentProps {
  index: number
  remove: (index?: number | number[] | undefined) => void
  parentIsDeadFieldId: string
  application: Application
  errors?: RecordObject
}

export const Parent: FC<React.PropsWithChildren<ParentProps>> = ({
  index,
  remove,
  parentIsDeadFieldId,
  application,
  errors,
}) => {
  const { setValue, watch } = useFormContext()
  const { formatMessage, lang } = useLocale()
  const [hasError, setHasError] = useState<string | undefined>(undefined)
  const [identityFound, setIdentityFound] = useState(true)
  const fieldIndex = `${parentIsDeadFieldId}[${index}]`
  const nameFieldId = `${fieldIndex}.name`
  const parentDoesNotHaveNationalIdFieldId = `${fieldIndex}.parentDoesNotHaveNationalId`
  const nationalIdOrBirthDateFieldId = `${fieldIndex}.nationalIdOrBirthDate`

  const parentDoesNotHaveNationalIdField = watch(
    parentDoesNotHaveNationalIdFieldId,
    false,
  )

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
  }, [personNationalId, getIdentity, setValue, nameFieldId])

  return (
    <Box
      padding={3}
      borderRadius="large"
      borderColor="blue200"
      border="standard"
      marginTop={index === 1 ? 2 : undefined}
    >
      {index === 0 ? (
        <Text variant="h4" as="h3" marginBottom={1}>
          {formatText(
            childPensionFormMessage.info.childPensionReasonParentIsDeadTitle,
            application,
            formatMessage,
          )}
        </Text>
      ) : (
        <Box display="flex" justifyContent="spaceBetween" marginBottom={1}>
          <Text variant="h4" as="h3">
            {formatText(
              childPensionFormMessage.info
                .childPensionReasonOtherParentIsDeadTitle,
              application,
              formatMessage,
            )}
          </Text>

          <Box>
            <Button
              colorScheme="default"
              iconType="filled"
              size="small"
              type="button"
              variant="text"
              icon="trash"
              onClick={() => remove(index)}
            >
              {formatMessage(
                childPensionFormMessage.info
                  .childPensionReasonParentIsDeadRemoveParent,
              )}
            </Button>
          </Box>
        </Box>
      )}
      <Box marginTop={2}>
        <Controller
          name={parentDoesNotHaveNationalIdFieldId}
          defaultValue={false}
          render={({ field: { onChange, value } }) => {
            return (
              <Box>
                <Checkbox
                  id={parentDoesNotHaveNationalIdFieldId}
                  name={parentDoesNotHaveNationalIdFieldId}
                  label={formatText(
                    childPensionFormMessage.info
                      .childPensionParentDoesNotHaveNationalId,
                    application,
                    formatMessage,
                  )}
                  checked={value}
                  onChange={(e) => {
                    onChange(e.target.checked)
                    setValue(
                      parentDoesNotHaveNationalIdFieldId,
                      e.target.checked,
                    )

                    setValue(nationalIdOrBirthDateFieldId, undefined)
                    setHasError(undefined)
                    setValue(nameFieldId, '')
                    setIdentityFound(true)
                  }}
                />
              </Box>
            )
          }}
        />
      </Box>

      <GridRow marginTop={2}>
        {parentDoesNotHaveNationalIdField ? (
          <>
            <GridColumn span="1/2">
              <DatePickerController
                id={nationalIdOrBirthDateFieldId}
                locale={lang}
                backgroundColor="blue"
                label={formatText(
                  childPensionFormMessage.info.childPensionParentBirthDate,
                  application,
                  formatMessage,
                )}
                placeholder={formatText(
                  childPensionFormMessage.info
                    .registerChildBirthDatePlaceholder,
                  application,
                  formatMessage,
                )}
                error={hasError}
                onChange={(d) => {
                  setValue(nationalIdOrBirthDateFieldId as string, d)
                }}
              />
            </GridColumn>
            <GridColumn span="1/2">
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
            </GridColumn>
          </>
        ) : (
          <>
            <GridColumn span="1/2">
              <InputController
                id={nationalIdOrBirthDateFieldId}
                placeholder="000000-0000"
                label={formatText(
                  childPensionFormMessage.info
                    .childPensionParentIsDeadNationalId,
                  application,
                  formatMessage,
                )}
                error={hasError}
                onChange={(e) => {
                  setValue(
                    nationalIdOrBirthDateFieldId as string,
                    e.target.value,
                  )
                }}
                format="######-####"
                backgroundColor="blue"
                loading={queryLoading}
              />
            </GridColumn>
            <GridColumn span="1/2">
              <InputController
                id={nameFieldId}
                label={formatText(
                  childPensionFormMessage.info.registerChildFullName,
                  application,
                  formatMessage,
                )}
                onChange={(e) => {
                  setValue(nameFieldId as string, e.target.value)
                }}
                backgroundColor="blue"
                disabled={true}
              />
            </GridColumn>
          </>
        )}
      </GridRow>
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
  )
}
