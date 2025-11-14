import { FC, useEffect, useState } from 'react'
import { GridRow, GridColumn } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { coreErrorMessages, getValueViaPath } from '@island.is/application/core'
import { Application, StaticText } from '@island.is/application/types'
import { gql, useLazyQuery } from '@apollo/client'
import {
  IdentityInput,
  Query,
  RskCompanyInfoInput,
} from '@island.is/api/schema'
import {
  InputController,
  PhoneInputController,
} from '@island.is/shared/form-fields'
import { useFormContext } from 'react-hook-form'
import * as kennitala from 'kennitala'
import debounce from 'lodash/debounce'
import { COMPANY_IDENTITY_QUERY, IDENTITY_QUERY } from './graphql/queries'
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
  const { setValue } = useFormContext()
  const [nationalIdInput, setNationalIdInput] = useState('')

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
          } else if (
            searchPersons &&
            !searchCompanies &&
            data?.identity === null
          ) {
            setValue(nameField, '')
          } else if (
            searchPersons &&
            searchCompanies &&
            companyData?.companyRegistryCompany === null
          ) {
            setValue(nameField, '')
          }
        },
      },
    )

  // query to get company name by national id
  const [
    getCompanyIdentity,
    {
      data: companyData,
      loading: companyQueryLoading,
      error: companyQueryError,
    },
  ] = useLazyQuery<Query, { input: RskCompanyInfoInput }>(
    gql`
      ${COMPANY_IDENTITY_QUERY}
    `,
    {
      onCompleted: (companyData) => {
        onNameChange &&
          onNameChange(companyData.companyRegistryCompany?.name ?? '')
        if (companyData.companyRegistryCompany?.name) {
          setValue(nameField, companyData.companyRegistryCompany?.name)
        } else if (
          !searchPersons &&
          searchCompanies &&
          companyData?.companyRegistryCompany === null
        ) {
          setValue(nameField, '')
        } else if (
          searchPersons &&
          searchCompanies &&
          data?.identity === null
        ) {
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
      return
    }

    if (kennitala.isValid(nationalIdInput)) {
      setInvalidNationalId(false)
      searchPersons &&
        getIdentity({
          variables: {
            input: {
              nationalId: nationalIdInput,
            },
          },
        })

      searchCompanies &&
        getCompanyIdentity({
          variables: {
            input: {
              nationalId: nationalIdInput,
            },
          },
        })
    } else {
      setValue(nameField, '')
      setInvalidNationalId(true)
    }
  }, [
    nationalIdInput,
    getIdentity,
    getCompanyIdentity,
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
            loading={
              searchPersons
                ? queryLoading
                : searchCompanies
                ? companyQueryLoading
                : undefined
            }
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
            error={
              searchPersons
                ? queryError || data?.identity === null || invalidNationalId
                  ? formatMessage(
                      coreErrorMessages.nationalRegistryNameNotFoundForNationalId,
                    )
                  : getFieldErrorString(error, 'name') && !data
                  ? getFieldErrorString(error, 'name')
                  : undefined
                : searchCompanies
                ? companyQueryError ||
                  companyData?.companyRegistryCompany === null
                  ? formatMessage(
                      coreErrorMessages.nationalRegistryNameNotFoundForNationalId,
                    )
                  : getFieldErrorString(error, 'name') && !companyData
                  ? getFieldErrorString(error, 'name')
                  : undefined
                : undefined
            }
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
