import React, { FC, useState, useCallback } from 'react'
import { FieldBaseProps, getErrorViaPath } from '@island.is/application/core'
import {
  AlertMessage,
  AsyncSearch,
  AsyncSearchOption,
  Box,
} from '@island.is/island-ui/core'
import { Controller, useFormContext } from 'react-hook-form'
import { SearchItem } from './SearchItem'
import debounce from 'lodash/debounce'
import { useLazyQuery } from '@apollo/client'
import { COMPANY_REGISTRY_COMPANIES } from './searchQuery'
import kennitala from 'kennitala'
import { useLocale } from '@island.is/localization'
import { employer, error } from '../../lib/messages'

export const CompanySearch: FC<FieldBaseProps> = ({
  field,
  errors = {},
  application,
}) => {
  const { formatMessage } = useLocale()
  const { clearErrors, setValue } = useFormContext()
  const defaultAnswer = { value: '', label: '' }
  const { id } = field
  const initialValue = (application.answers[id] || { ...defaultAnswer }) as {
    value: string
    label: string
  }
  const [searchQuery, setSearchQuery] = useState('')
  const [search, { loading, data }] = useLazyQuery(COMPANY_REGISTRY_COMPANIES)
  const debouncer = useCallback(debounce(search, 1), [searchQuery])

  // Validations
  const errorMessage = errors
    ? getErrorViaPath(errors, 'correctedEmployer.nationalId')
    : null
  const noResultsFound =
    data?.companyRegistryCompanies?.data?.length === 0 &&
    !loading &&
    searchQuery.trim().length > 0
  const invalidNationalId =
    !kennitala.isValid(searchQuery) && !loading && searchQuery.length === 10

  const onSelect = (selection: AsyncSearchOption | null) => {
    const { value, label } = selection || {}
    if (value && label) {
      setValue(id, { nationalId: value, label })
    }
  }

  const onInputChange = (inputValue: string) => {
    setValue(id, { nationalId: '', label: '' })
    clearErrors(id)
    const query = inputValue?.trim() || ''
    setSearchQuery(query)
    debouncer({
      variables: {
        input: {
          searchTerm: query,
          first: 100,
        },
      },
    })
  }

  const getSearchOptions = (
    query: string,
    response: { data: { name: string; nationalId: string }[] } = { data: [] },
  ) => {
    const { data } = response
    const options = data?.map(({ name, nationalId }) => ({
      label: name,
      value: nationalId,
      component: (props: any) => (
        <SearchItem
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

  return (
    <Box marginTop={[2, 4]}>
      <Controller
        name={id}
        defaultValue={initialValue}
        render={() => {
          return (
            <AsyncSearch
              loading={loading}
              options={getSearchOptions(
                searchQuery,
                data?.companyRegistryCompanies,
              )}
              size="large"
              placeholder={formatMessage(
                employer.labels.searchCompanyPlaceholer,
              )}
              colored
              inputValue={searchQuery}
              label={formatMessage(employer.labels.searchCompany)}
              onInputValueChange={(query) => onInputChange(query)}
              initialInputValue={initialValue.label}
              onChange={(selection) => onSelect(selection)}
            />
          )
        }}
      />
      {invalidNationalId && (
        <Box marginTop={[2, 2]}>
          <AlertMessage
            type="error"
            title={formatMessage(error.invalidNationalIdTitle)}
            message={formatMessage(error.invalidNationalIdMessage)}
          />
        </Box>
      )}
      {(errorMessage || noResultsFound) && !invalidNationalId && (
        <Box marginTop={[2, 2]}>
          <AlertMessage
            type="error"
            title={formatMessage(error.noCompanyResultsTitle)}
            message={formatMessage(error.noCompanyResultsMessage)}
          />
        </Box>
      )}
    </Box>
  )
}
