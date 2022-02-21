import React, { FC, useState, useCallback, useEffect } from 'react'
import { FieldBaseProps, getErrorViaPath } from '@island.is/application/core'
import { AlertBanner, AlertMessage, AsyncSearch, AsyncSearchOption, Box, } from '@island.is/island-ui/core'
import { Controller, useFormContext } from 'react-hook-form'
import { SearchItem } from './SearchItem'
import { debounce } from 'lodash'
import { useLazyQuery } from '@apollo/client'
import { COMPANY_REGISTRY_COMPANIES } from './searchQuery'

interface Props extends FieldBaseProps { }

export const CompanySearch: FC<Props> = ({ field, errors = {}, application }) => {
  const { clearErrors, setValue } = useFormContext()
  const defaultAnswer = { value: '', label: '' }
  const { id } = field
  const error = getErrorViaPath(errors, id)
  const initialValue = (application.answers[id] || { ...defaultAnswer }) as { value: string, label: string }
  const [searchQuery, setSearchQuery] = useState('')
  const [search, { loading, data }] = useLazyQuery(COMPANY_REGISTRY_COMPANIES);
  const debouncer = useCallback(debounce(search, 250), []);

  console.log('answers', application.answers)
  console.log('Error', error)
  const onSelect = (
    selection: AsyncSearchOption | null,
    onChangeHandler: (args?: any) => void,
  ) => {
    console.log('On Select')
    const { value, label } = selection || {}
    if (value && label) {
      clearErrors(`${id}.nationalId`)
      setValue(`${id}.nationalId`, value)
      setValue(`${id}.label`, label)
      onChangeHandler({ nationalId: value, label })
    }
  }

  const onInputChange = (inputValue: string, onChangeHandler: (args?: any) => void) => {
    console.log('On input Change')
    const query = inputValue?.trim() || ""
    setSearchQuery(query)
    onChangeHandler(defaultAnswer)
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
      value: nationalId,
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
          id={`${id}`}
          defaultValue={initialValue}
          render={({ onChange, value }) => {
            return (
              <>
                <AsyncSearch
                  loading={loading}
                  options={getSearchOptions(searchQuery, data?.companyRegistryCompanies)}
                  size="large"
                  placeholder="Sláðu inn nafn eða kennitölu"
                  colored
                  label="Leitaðu af fyrirtæki"
                  onInputValueChange={(selection) => onInputChange(selection, onChange)}
                  initialInputValue={initialValue.label}
                  onChange={(selection) => onSelect(selection, onChange)}
                />
              </>
            )
          }}
        />
        {error && (
          <Box marginTop={[2, 2]}>
            <AlertMessage type="error" title="Engar niðurstöður fundust hjá fyrirtækjaskrá" message="Vinsamlegast athugaðu hvort að það er rétt slegið inn." />
          </Box>
        )}
      </Box >
    </>
  )
}
