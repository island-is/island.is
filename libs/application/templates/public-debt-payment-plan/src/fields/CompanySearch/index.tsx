import React, { FC, useState, useCallback } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import { AlertBanner, AlertMessage, AsyncSearch, AsyncSearchOption, Box } from '@island.is/island-ui/core'
import { Controller } from 'react-hook-form'
import { SearchItem } from './SearchItem'
import { debounce } from 'lodash'
import { useLazyQuery } from '@apollo/client'
import { COMPANY_REGISTRY_COMPANIES } from './searchQuery'

interface Props extends FieldBaseProps { }

export const CompanySearch: FC<Props> = ({ field }) => {
  const { id } = field
  const [searchQuery, setSearchQuery] = useState('')
  const [search, { loading, data }] = useLazyQuery(COMPANY_REGISTRY_COMPANIES);
  const hasNoResults = !loading && data?.companyRegistryCompanies?.data?.length === 0 && searchQuery.length > 0
  console.log(hasNoResults)
  const debouncer = useCallback(debounce(search, 250), []);

  const onChangeHandler = (
    selection: AsyncSearchOption | null,
    callback: (args?: any) => void,
  ) => {
    callback(selection?.value || '')
  }

  const onInputValueChangeHandler = (inputValue: string,) => {
    const query = inputValue?.trim() || ""
    setSearchQuery(query)
    debouncer({
      variables: {
        input: {
          searchTerm: query,
          first: 100
        }
      }
    })
  }


  const getSearchOptions = (query: string, response: { data: { name: string, nationalId: string }[] } = { data: [] }) => {
    const { data } = response
    const options = data?.map(({ name, nationalId }) => ({
      label: `${name} - ${nationalId}`,
      value: name,
      component: (props: any) => (
        <SearchItem
          {...props}
          key={`${name}-${nationalId}`}
          name={name}
          nationalId={nationalId}
          query={query}
        />
      )
    }))
    return options || []
  }

  return (
    <>
      <Box marginTop={[2, 4]}>
        <Controller
          name={`${id}`}
          defaultValue={""}
          render={({ onChange, value }) => {
            return (
              <AsyncSearch
                loading={loading}
                options={getSearchOptions(searchQuery, data?.companyRegistryCompanies)}
                size="large"
                placeholder="Sláðu inn nafn eða kennitölu"
                colored
                label="Leitaðu af fyrirtæki"
                onInputValueChange={onInputValueChangeHandler}
                initialInputValue={value}
                onChange={(selection) => onChangeHandler(selection, onChange)}
              />
            )
          }}
        />
        {hasNoResults && (
          <Box marginTop={[2, 2]}>
            <AlertMessage type="error" title="Engar niðurstöður fundust hjá fyrirtækjaskrá" message="Vinsamlegast athugaðu hvort að það er rétt slegið inn." />
          </Box>
        )}
      </Box >
    </>
  )
}
