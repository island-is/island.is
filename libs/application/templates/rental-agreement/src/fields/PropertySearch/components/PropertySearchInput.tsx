import { useEffect, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Query, HmsSearchInput } from '@island.is/api/schema'
import { AsyncSearch, Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useLazyQuery } from '@apollo/client'
import { ADDRESS_SEARCH_QUERY } from '../../../graphql/queries'
import { AddressProps } from '..'
import { registerProperty } from '../../../lib/messages'

interface PropertySearchInputProps {
  id: string
}

export const PropertySearchInput: React.FC<PropertySearchInputProps> = ({
  id,
}) => {
  const { formatMessage } = useLocale()
  const { clearErrors, setValue, getValues } = useFormContext()
  const storedValue = getValues(id)
  const [searchTerm, setSearchTerm] = useState(storedValue?.value)
  const [searchOptions, setSearchOptions] = useState<AddressProps[]>([])
  const [selectedAddress, setSelectedAddress] = useState<
    AddressProps | undefined
  >(storedValue)

  useEffect(() => {
    if (searchTerm?.length) {
      hmsSearch({
        variables: {
          input: {
            partialStadfang: searchTerm,
          },
        },
      })
    } else {
      setSearchOptions([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm])

  /**
   * GraphQL query to fetch and format address search results.
   */
  const [hmsSearch, { loading: searchLoading }] = useLazyQuery<
    Query,
    { input: HmsSearchInput }
  >(ADDRESS_SEARCH_QUERY, {
    onError: (error) => {
      console.error('Error fetching address', error)
    },
    onCompleted: (data) => {
      if (!data.hmsSearch) {
        return
      }
      const searchOptions = data.hmsSearch.addresses.map((address) => ({
        ...address,
        label: `${address.address}, ${address.postalCode} ${address.municipalityName}`,
        value: `${address.addressCode}`,
      }))
      setSearchOptions(searchOptions)
    },
  })

  const handleAddressSelectionChange = (
    selection: { value: string } | null,
  ) => {
    clearErrors(id)
    const selectedValue = selection === null ? undefined : selection.value
    const selectedOption = searchOptions.find(
      (option) => option.value === selectedValue,
    )
    setSelectedAddress(selectedOption)
    setValue(id, selection ? selection : undefined)
  }

  return (
    <Box>
      <Controller
        name={`${id}`}
        defaultValue=""
        render={({ field: { onChange } }) => {
          return (
            <AsyncSearch
              options={searchOptions}
              placeholder={formatMessage(
                registerProperty.search.propertySearchPlaceholder,
              )}
              initialInputValue={selectedAddress ? selectedAddress.label : ''}
              inputValue={
                searchTerm || (selectedAddress ? selectedAddress.label : '')
              }
              closeMenuOnSubmit
              size="large"
              colored
              onChange={(selection) => {
                handleAddressSelectionChange(selection)
                onChange(selection ? selection : undefined)
              }}
              onInputValueChange={(newValue) => {
                setSearchTerm(newValue)
              }}
              loading={searchLoading}
            />
          )
        }}
      />
    </Box>
  )
}
