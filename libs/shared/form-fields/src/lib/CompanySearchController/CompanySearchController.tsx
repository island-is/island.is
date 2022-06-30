import React, { FC, useMemo, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { AsyncSearch, Box, AlertMessage } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { coreErrorMessages } from '@island.is/application/core'
import { gql, useLazyQuery } from '@apollo/client'
import debounce from 'lodash/debounce'
import { CompanySearchItem } from './CompanySearchItem'
import { debounceTime } from '@island.is/shared/constants'

export const COMPANY_REGISTRY_COMPANIES = gql`
  query SearchCompanies($input: RskCompanyInfoSearchInput!) {
    companyRegistryCompanies(input: $input) {
      data {
        name
        nationalId
      }
    }
  }
`

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
  setNationalId?: (s: string) => void
}

export const CompanySearchController: FC<Props> = ({
  defaultValue,
  id,
  name = id,
  label,
  placeholder,
  initialInputValue = '',
  inputValue = '',
  colored = true,
  setLabelToDataSchema = true,
  setNationalId,
}) => {
  const { clearErrors, setValue } = useFormContext()
  const { formatMessage } = useLocale()

  const [searchQuery, setSearchQuery] = useState('')

  const [search, { loading, data }] = useLazyQuery(COMPANY_REGISTRY_COMPANIES)

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
    response: { data: { name: string; nationalId: string }[] } = { data: [] },
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

  return (
    <>
      <Controller
        name={name}
        defaultValue={defaultValue}
        render={() => {
          return (
            <AsyncSearch
              label={label}
              loading={loading}
              options={getSearchOptions(
                searchQuery,
                data?.companyRegistryCompanies,
              )}
              size="large"
              placeholder={placeholder}
              initialInputValue={initialInputValue}
              inputValue={inputValue}
              onInputValueChange={(query) => {
                setValue(
                  id,
                  setLabelToDataSchema
                    ? { nationalId: '', label: '' }
                    : { nationalId: '' },
                )
                clearErrors(id)
                const inputValue = query?.trim() || ''
                onInputChange(inputValue)
              }}
              colored={colored}
              onChange={(selection) => {
                const { value, label } = selection || {}
                if (value && label) {
                  setNationalId && setNationalId(value)
                  setValue(
                    id,
                    setLabelToDataSchema
                      ? { nationalId: value, label }
                      : { nationalId: value },
                  )
                }
              }}
            />
          )
        }}
      />
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
