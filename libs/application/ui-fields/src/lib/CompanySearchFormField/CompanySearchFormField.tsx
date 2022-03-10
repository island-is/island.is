import { gql, useLazyQuery } from '@apollo/client'
import {
  CompanySearchField,
  FieldBaseProps,
  formatText,
} from '@island.is/application/core'
import { Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import debounce from 'lodash/debounce'
import React, { FC, useMemo, useState } from 'react'
import { CompanySearchItem } from './CompanySearchItem'
import kennitala from 'kennitala'
import { CompanySearchController } from '@island.is/shared/form-fields'
import { mockCompanies } from './__mock-data__/companies'

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

interface Props extends FieldBaseProps {
  field: CompanySearchField
}

export const CompanySearchFormField: FC<Props> = ({ application, field }) => {
  const {
    id,
    title,
    placeholder,
    setLabelToDataSchema = true,
    useMockOptions = false,
  } = field
  const { formatMessage } = useLocale()

  const [searchQuery, setSearchQuery] = useState('')
  const [mockData, setMockData] = useState(mockCompanies)

  const [search, { loading, data }] = useLazyQuery(COMPANY_REGISTRY_COMPANIES)

  const defaultAnswer = { value: '', label: '' }
  const initialValue = (application.answers[id] || { ...defaultAnswer }) as {
    value: string
    label: string
  }

  const debouncer = useMemo(() => {
    return debounce(search, 250)
  }, [search])

  // Validations
  const noResultsFound =
    data?.companyRegistryCompanies?.data?.length === 0 &&
    !loading &&
    searchQuery.trim().length > 0
  const invalidNationalId =
    !kennitala.isValid(searchQuery) && !loading && searchQuery.length === 10

  const onInputChange = (inputValue: string) => {
    setSearchQuery(inputValue)
    if (useMockOptions) {
      let data = mockCompanies.filter(
        (x) =>
          x.name.toLowerCase().includes(inputValue.toLowerCase()) ||
          x.nationalId.includes(inputValue),
      )
      if (!inputValue) {
        data = []
      }
      setMockData(data)
    } else
      debouncer({
        variables: {
          input: {
            searchTerm: inputValue,
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
    <Box marginTop={[2, 4]}>
      <CompanySearchController
        invalidNationalIdError={invalidNationalId}
        noResultsFound={noResultsFound && !invalidNationalId}
        id={id}
        defaultValue={initialValue}
        name={id}
        label={formatText(title, application, formatMessage)}
        loading={loading}
        options={getSearchOptions(
          searchQuery,
          useMockOptions ? { data: mockData } : data?.companyRegistryCompanies,
        )}
        placeholder={
          placeholder !== undefined
            ? formatText(placeholder as string, application, formatMessage)
            : undefined
        }
        initialInputValue={initialValue.label}
        inputValue={searchQuery}
        colored
        onInputChange={onInputChange}
        setLabelToDataSchema={setLabelToDataSchema}
      />
    </Box>
  )
}
