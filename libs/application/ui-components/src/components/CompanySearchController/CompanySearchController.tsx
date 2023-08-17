import { AlertMessage, AsyncSearch, Box, Icon } from '@island.is/island-ui/core'
import { Controller, useFormContext } from 'react-hook-form'
import React, { FC, useEffect, useMemo, useState } from 'react'
import {
  useIsEmployerValidLazyQuery,
  useSearchCompaniesLazyQuery,
} from '../../../gen/graphql'

import { CompanySearchItem } from './CompanySearchItem'
import { coreErrorMessages, getErrorViaPath } from '@island.is/application/core'
import debounce from 'lodash/debounce'
import { debounceTime } from '@island.is/shared/constants'
import { useLocale } from '@island.is/localization'

interface Props {
  id: string
  defaultValue?: unknown
  name?: string
  label: string
  placeholder?: string
  initialInputValue?: string
  inputValue?: string
  colored?: boolean
  setLabelToDataSchema?: boolean
  shouldIncludeIsatNumber?: boolean
  error?: string
  setNationalId?: (s: string) => void
  checkIfEmployerIsOnForbiddenList?: boolean
  required?: boolean
}

export const CompanySearchController: FC<React.PropsWithChildren<Props>> = ({
  defaultValue,
  id,
  shouldIncludeIsatNumber,
  name = id,
  label,
  placeholder,
  initialInputValue = '',
  inputValue = '',
  colored = true,
  setLabelToDataSchema = true,
  setNationalId,
  checkIfEmployerIsOnForbiddenList,
  required,
}) => {
  const {
    clearErrors,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext()
  const { formatMessage } = useLocale()
  const [searchQuery, setSearchQuery] = useState('')
  const [search, { loading, data }] = useSearchCompaniesLazyQuery()
  const [
    getIsEmployerValid,
    { loading: employerValidLoading, data: employerValidData },
  ] = useIsEmployerValidLazyQuery()
  const [companyIsValid, setCompanyIsValid] = useState<boolean>(false)
  useEffect(() => {
    const isValid = employerValidData?.isEmployerValid ?? true
    const currForm = getValues(id)
    setCompanyIsValid(isValid)
    setValue(id, {
      ...currForm,
      validEmployer: isValid,
    })
  }, [employerValidData?.isEmployerValid, getValues, id, setValue])

  const debouncer = useMemo(() => {
    return debounce(search, debounceTime.search)
  }, [search])

  // Validations
  const noResultsFound =
    data?.companyRegistryCompanies?.data?.length === 0 &&
    !loading &&
    searchQuery.trim().length > 0

  const onInputChange = (inputValue: string) => {
    setSearchQuery(inputValue)
    debouncer({
      variables: {
        input: {
          searchTerm: inputValue,
          first: 40,
        },
      },
    })
  }

  const getSearchOptions = (
    query: string,
    response: {
      data: { name: string; nationalId: string }[]
    } = { data: [] },
  ) => {
    const { data } = response
    const options = data?.map(({ name, nationalId }) => ({
      label: name,
      value: nationalId,
      component: (props: any) => (
        <CompanySearchItem
          {...props}
          key={`${name}-${nationalId}`}
          name={name}
          nationalId={nationalId}
          query={query}
        />
      ),
    }))
    return options || []
  }

  const getIsatNumber = (nationalId: string) => {
    if (!shouldIncludeIsatNumber) {
      return
    }

    const companies = data?.companyRegistryCompanies?.data ?? []
    if (companies.length === 0) return ''

    const filteredCompany = companies.find(
      (company) => company.nationalId === nationalId,
    )

    if (!filteredCompany?.companyInfo) {
      return
    }

    const vats = filteredCompany.companyInfo.vat

    for (const v of vats) {
      if (!v.dateOfDeregistration && v.classification) {
        const c = v.classification.find((c) => c.type === 'Aðal')
        if (c) {
          const isat = `${c.number} - ${c.name}`
          const currForm = getValues(id)
          currForm.isat = isat
          setValue(id, currForm)
        }
      }
    }
  }

  const callValidateEmployer = (nationalId: string) => {
    if (!checkIfEmployerIsOnForbiddenList) {
      return
    }
    getIsEmployerValid({
      variables: { input: { companyId: nationalId } },
    })
  }

  return (
    <>
      <Controller
        name={name}
        defaultValue={defaultValue}
        render={() => {
          return (
            <AsyncSearch
              label={label}
              loading={loading || employerValidLoading}
              required={required}
              options={getSearchOptions(
                searchQuery,
                data?.companyRegistryCompanies,
              )}
              errorMessage={
                errors && getErrorViaPath(errors, `${id}.nationalId`)
              }
              size="large"
              placeholder={placeholder}
              initialInputValue={initialInputValue}
              inputValue={inputValue}
              onInputValueChange={(query) => {
                setValue(
                  id,
                  setLabelToDataSchema
                    ? { isat: '', nationalId: '', label: '' }
                    : { isat: '', nationalId: '' },
                )
                clearErrors(id)
                const inputValue = query?.trim() || ''
                onInputChange(inputValue)
              }}
              colored={colored}
              onChange={(selection) => {
                const { value, label } = selection || {}
                if (value && label) {
                  callValidateEmployer(value)
                  setNationalId && setNationalId(value)
                  setValue(
                    id,
                    setLabelToDataSchema
                      ? {
                          nationalId: value,
                          label,
                        }
                      : { nationalId: value },
                  )
                  getIsatNumber(value)
                }
              }}
            />
          )
        }}
      />
      {checkIfEmployerIsOnForbiddenList &&
        !employerValidLoading &&
        !companyIsValid && (
          <Box marginTop={[2, 2]}>
            <AlertMessage
              type="error"
              title={formatMessage(
                coreErrorMessages.invalidCompanySelectedTitle,
              )}
              message={formatMessage(
                coreErrorMessages.invalidCompanySelectedMessage,
              )}
            />
          </Box>
        )}
      {noResultsFound && (
        <Box marginTop={[2, 2]}>
          <AlertMessage
            type="error"
            title={formatMessage(
              coreErrorMessages.noCompanySearchResultsFoundTitle,
            )}
            message={formatMessage(
              coreErrorMessages.noCompanySearchResultsFoundMessage,
            )}
          />
        </Box>
      )}
    </>
  )
}

export default CompanySearchController
