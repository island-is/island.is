import { FC, useEffect, useState } from 'react'
import { GridRow, GridColumn } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  coreErrorMessages,
  getErrorViaPath,
  getValueViaPath,
} from '@island.is/application/core'
import { Application, StaticText } from '@island.is/application/types'
import { gql, useLazyQuery } from '@apollo/client'
import {
  IdentityInput,
  Query,
  RskCompanyInfoInput,
} from '@island.is/api/schema'
import { InputController } from '@island.is/shared/form-fields'
import { useFormContext } from 'react-hook-form'
import * as kennitala from 'kennitala'
import debounce from 'lodash/debounce'
import { COMPANY_IDENTITY_QUERY, IDENTITY_QUERY } from './graphql/queries'

interface NationalIdWithNameProps {
  id: string
  application: Application
  disabled?: boolean
  required?: boolean
  customId?: string
  customNationalIdLabel?: StaticText
  customNameLabel?: StaticText
  onNationalIdChange?: (s: string) => void
  onNameChange?: (s: string) => void
  nationalIdDefaultValue?: string
  nameDefaultValue?: string
  errorMessage?: string
  minAgePerson?: number
  searchPersons?: boolean
  searchCompanies?: boolean
}

export const NationalIdWithName: FC<
  React.PropsWithChildren<NationalIdWithNameProps>
> = ({
  id,
  application,
  disabled,
  required,
  customId = '',
  customNationalIdLabel = '',
  customNameLabel = '',
  onNationalIdChange,
  onNameChange,
  nationalIdDefaultValue,
  nameDefaultValue,
  errorMessage,
  minAgePerson,
  searchPersons = true,
  searchCompanies = false,
}) => {
  const fieldId = customId.length > 0 ? customId : id
  const nameField = `${fieldId}.name`
  const nationalIdField = `${fieldId}.nationalId`

  const { formatMessage } = useLocale()
  const {
    setValue,
    formState: { errors },
  } = useFormContext()
  const [nationalIdInput, setNationalIdInput] = useState('')
  const [personName, setPersonName] = useState('')
  const [companyName, setCompanyName] = useState('')

  // get name validation errors
  const nameFieldErrors = errorMessage
    ? nameDefaultValue?.length === 0
      ? errorMessage
      : undefined
    : getErrorViaPath(errors, nameField)

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
    nationalIdFieldErrors = getErrorViaPath(errors, nationalIdField)
  }

  // get default values
  const defaultNationalId = nationalIdDefaultValue
    ? nationalIdDefaultValue
    : getValueViaPath(application.answers, nationalIdField, '')
  const defaultName = nameDefaultValue
    ? nameDefaultValue
    : getValueViaPath(application.answers, nameField, '')

  // query to get name by national id
  const [getIdentity, { data, loading: queryLoading, error: queryError }] =
    useLazyQuery<Query, { input: IdentityInput }>(
      gql`
        ${IDENTITY_QUERY}
      `,
      {
        onCompleted: (data) => {
          onNameChange && onNameChange(data.identity?.name ?? '')
          setPersonName(data.identity?.name ?? '')
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
        setCompanyName(companyData.companyRegistryCompany?.name ?? '')
      },
    },
  )

  // fetch and update name when user has entered a valid national id
  useEffect(() => {
    if (nationalIdInput.length === 10 && kennitala.isValid(nationalIdInput)) {
      {
        searchPersons &&
          getIdentity({
            variables: {
              input: {
                nationalId: nationalIdInput,
              },
            },
          })
      }

      {
        searchCompanies &&
          getCompanyIdentity({
            variables: {
              input: {
                nationalId: nationalIdInput,
              },
            },
          })
      }
    }
  }, [
    nationalIdInput,
    getIdentity,
    getCompanyIdentity,
    searchPersons,
    searchCompanies,
  ])

  useEffect(() => {
    const nameInAnswers = getValueViaPath(application.answers, nameField)
    if (personName && nameInAnswers !== personName) {
      setValue(nameField, personName)
    } else if (companyName && nameInAnswers !== companyName) {
      setValue(nameField, companyName)
    }
  }, [personName, companyName, setValue, nameField, application.answers])

  return (
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
          backgroundColor="blue"
          onChange={debounce((v) => {
            setNationalIdInput(v.target.value.replace(/\W/g, ''))
            onNationalIdChange &&
              onNationalIdChange(v.target.value.replace(/\W/g, ''))
          })}
          loading={searchPersons ? queryLoading : companyQueryLoading}
          error={nationalIdFieldErrors}
          disabled={disabled}
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
          required={required}
          error={
            searchPersons
              ? queryError || data?.identity === null
                ? formatMessage(
                    coreErrorMessages.nationalRegistryNameNotFoundForNationalId,
                  )
                : nameFieldErrors && !data
                ? nameFieldErrors
                : undefined
              : searchCompanies
              ? companyQueryError ||
                companyData?.companyRegistryCompany === null
                ? formatMessage(
                    coreErrorMessages.nationalRegistryNameNotFoundForNationalId,
                  )
                : nameFieldErrors && !companyData
                ? nameFieldErrors
                : undefined
              : undefined
          }
          disabled={disabled}
          readOnly={!disabled}
        />
      </GridColumn>
    </GridRow>
  )
}
