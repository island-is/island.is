import { FC, useEffect, useState } from 'react'
import { GridRow, GridColumn } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { coreErrorMessages, getValueViaPath } from '@island.is/application/core'
import { Application, StaticText } from '@island.is/application/types'
import { gql, useLazyQuery } from '@apollo/client'
import { IdentityInput, Query } from '@island.is/api/schema'
import {
  InputController,
  PhoneInputController,
} from '@island.is/shared/form-fields'
import { useFormContext } from 'react-hook-form'
import * as kennitala from 'kennitala'
import debounce from 'lodash/debounce'
import { IDENTITY_QUERY } from './graphql/queries'
import { setInputsOnChange } from '@island.is/shared/utils'

interface NationalIdWithNameProps {
  id: string
  application: Application
  disabled?: boolean
  required?: boolean
  readOnly?: boolean
  customId?: string
  customNationalIdLabel?: StaticText
  customNameLabel?: StaticText
  phoneLabel?: StaticText
  emailLabel?: StaticText
  phoneRequired?: boolean
  emailRequired?: boolean
  onNationalIdChange?: (s: string) => void
  onNameChange?: (s: string) => void
  nationalIdDefaultValue?: string
  nameDefaultValue?: string
  phoneDefaultValue?: string
  emailDefaultValue?: string
  errorMessage?: string
  minAgePerson?: number
  searchPersons?: boolean
  searchCompanies?: boolean
  showPhoneField?: boolean
  showEmailField?: boolean
  error?: string
  clearOnChange?: string[]
  setOnChange?:
    | { key: string; value: any }[]
    | ((value: string | undefined) => Promise<{ key: string; value: any }[]>)
}

export const NationalIdWithName: FC<
  React.PropsWithChildren<NationalIdWithNameProps>
> = ({
  id,
  application,
  disabled,
  required,
  readOnly,
  customId = '',
  customNationalIdLabel = '',
  phoneLabel = undefined,
  emailLabel = undefined,
  phoneRequired = false,
  emailRequired = false,
  customNameLabel = '',
  onNationalIdChange,
  onNameChange,
  nationalIdDefaultValue,
  nameDefaultValue,
  phoneDefaultValue,
  emailDefaultValue,
  errorMessage,
  minAgePerson,
  searchPersons = true,
  searchCompanies = false,
  showPhoneField = false,
  showEmailField = false,
  error,
  clearOnChange,
  setOnChange,
}) => {
  const [invalidNationalId, setInvalidNationalId] = useState(false)

  const fieldId = customId.length > 0 ? customId : id
  const nameField = `${fieldId}.name`
  const nationalIdField = `${fieldId}.nationalId`
  const emailField = `${fieldId}.email`
  const phoneField = `${fieldId}.phone`

  const { formatMessage } = useLocale()
  const { setValue, getValues } = useFormContext()
  const [nationalIdInput, setNationalIdInput] = useState(
    getValues(nationalIdField) || '',
  )

  const getFieldErrorString = (
    error: unknown,
    id: string,
  ): string | undefined => {
    if (!error || typeof error !== 'object') return undefined

    const errorList = error as Record<string, unknown>[]
    if (!Array.isArray(errorList)) {
      const fieldError = getValueViaPath<any>(errorList, id)
      return typeof fieldError === 'string' ? fieldError : undefined
    } else {
      const fieldError = errorList[id as any]
      return typeof fieldError === 'string' ? fieldError : undefined
    }
  }

  // get national id validation errors
  let nationalIdFieldErrors: string | undefined
  if (errorMessage && nationalIdDefaultValue?.length === 0) {
    nationalIdFieldErrors = errorMessage
  } else if (
    minAgePerson &&
    kennitala.isValid(nationalIdInput) &&
    !kennitala.isCompany(nationalIdInput) &&
    kennitala.info(nationalIdInput).age < minAgePerson
  ) {
    nationalIdFieldErrors = formatMessage(
      coreErrorMessages.nationalRegistryMinAgeNotFulfilled,
      { minAge: minAgePerson },
    )
  } else if (!errorMessage) {
    nationalIdFieldErrors = getFieldErrorString(error, 'nationalId')
  }

  const getNameFieldErrorMessage = () => {
    if (!nationalIdInput) return
    if (nationalIdInput.length !== 10) return

    const notFoundMessage = formatMessage(
      coreErrorMessages.nationalRegistryNameNotFoundForNationalId,
    )

    // Invalid national ID or mismatch with allowed search modes
    if (invalidNationalId) return notFoundMessage

    const queryFailed = queryError || data?.identity === null
    const nameError = getFieldErrorString(error, 'name')

    if (queryFailed) return notFoundMessage
    if (nameError && !data?.identity) return nameError

    return undefined
  }

  // get default values
  const defaultNationalId = nationalIdDefaultValue
    ? nationalIdDefaultValue
    : getValueViaPath(application.answers, nationalIdField, '')
  const defaultName = nameDefaultValue
    ? nameDefaultValue
    : getValueViaPath(application.answers, nameField, '')
  const defaultPhone = phoneDefaultValue
    ? phoneDefaultValue
    : getValueViaPath<string>(application.answers, phoneField, '')
  const defaultEmail = emailDefaultValue
    ? emailDefaultValue
    : getValueViaPath<string>(application.answers, emailField, '')

  // query to get name by national id
  const [getIdentity, { data, loading: queryLoading, error: queryError }] =
    useLazyQuery<Query, { input: IdentityInput }>(
      gql`
        ${IDENTITY_QUERY}
      `,
      {
        onCompleted: (data) => {
          onNameChange && onNameChange(data.identity?.name ?? '')
          if (data.identity?.name) {
            setValue(nameField, data.identity?.name)
          } else {
            setValue(nameField, '')
          }
        },
      },
    )

  // fetch and update name when user has entered a valid national id
  useEffect(() => {
    if (!nationalIdInput) {
      return
    }
    if (nationalIdInput.length !== 10) {
      // Clear name field whenever national id is not complete
      // avoids name lingering from previous valid national ids
      setValue(nameField, '')
      return
    }

    if (!kennitala.isValid(nationalIdInput)) {
      setValue(nameField, '')
      setInvalidNationalId(true)
      return
    }

    const isPerson = kennitala.isPerson(nationalIdInput)

    // Check if the search mode matches the provided nationalId
    const searchModeMismatch =
      ((searchPersons && !isPerson) || (searchCompanies && isPerson)) &&
      !(searchPersons && searchCompanies)

    // Prevent search if the provided nationalId does not match the searchMode
    if (searchModeMismatch) {
      setValue(nameField, '')
      // This results in an error shown provided by 'getNameFieldErrorMessage' func
      setInvalidNationalId(true)
      return
    }

    setInvalidNationalId(false)

    // Identity returns both companies and individuals
    getIdentity({
      variables: { input: { nationalId: nationalIdInput } },
    })
  }, [
    nationalIdInput,
    getIdentity,
    searchPersons,
    searchCompanies,
    setValue,
    nameField,
  ])

  return (
    <>
      <GridRow>
        <GridColumn span={['1/1', '1/1', '1/1', '1/2']} paddingTop={2}>
          <InputController
            id={nationalIdField}
            label={
              customNationalIdLabel
                ? formatMessage(customNationalIdLabel)
                : formatMessage(coreErrorMessages.nationalRegistryNationalId)
            }
            defaultValue={defaultNationalId}
            format="######-####"
            required={required}
            readOnly={readOnly}
            backgroundColor="blue"
            onChange={debounce(async (v) => {
              setNationalIdInput(v.target.value.replace(/\W/g, ''))
              onNationalIdChange &&
                onNationalIdChange(v.target.value.replace(/\W/g, ''))
              if (setOnChange) {
                setInputsOnChange(
                  typeof setOnChange === 'function'
                    ? await setOnChange(v.target.value.replace(/\W/g, ''))
                    : setOnChange,
                  setValue,
                )
              }
            })}
            loading={queryLoading}
            error={nationalIdFieldErrors}
            disabled={disabled}
            clearOnChange={clearOnChange}
          />
        </GridColumn>
        <GridColumn span={['1/1', '1/1', '1/1', '1/2']} paddingTop={2}>
          <InputController
            id={nameField}
            defaultValue={defaultName}
            label={
              customNameLabel
                ? formatMessage(customNameLabel)
                : formatMessage(coreErrorMessages.nationalRegistryName)
            }
            required={disabled ? required : false}
            error={getNameFieldErrorMessage()}
            disabled={disabled}
            readOnly={!disabled || readOnly}
          />
        </GridColumn>
      </GridRow>
      {(showPhoneField || showEmailField) && (
        <GridRow>
          {showPhoneField && (
            <GridColumn span={['1/1', '1/1', '1/1', '1/2']} paddingTop={3}>
              <PhoneInputController
                id={phoneField}
                label={
                  phoneLabel
                    ? formatMessage(phoneLabel)
                    : formatMessage(coreErrorMessages.nationalRegistryPhone)
                }
                defaultValue={defaultPhone}
                required={phoneRequired}
                backgroundColor="blue"
                error={getFieldErrorString(error, 'phone')}
                disabled={disabled}
                readOnly={readOnly}
              />
            </GridColumn>
          )}
          {showEmailField && (
            <GridColumn span={['1/1', '1/1', '1/1', '1/2']} paddingTop={3}>
              <InputController
                id={emailField}
                label={
                  emailLabel
                    ? formatMessage(emailLabel)
                    : formatMessage(coreErrorMessages.nationalRegistryEmail)
                }
                defaultValue={defaultEmail}
                type="email"
                required={emailRequired}
                backgroundColor="blue"
                error={getFieldErrorString(error, 'email')}
                disabled={disabled}
                readOnly={readOnly}
              />
            </GridColumn>
          )}
        </GridRow>
      )}
    </>
  )
}
