import { useLazyQuery } from '@apollo/client'
import { useLocale } from '@island.is/localization'
import { ADDRESS_SEARCH_QUERY } from '../../../graphql/queries'
import * as m from '../../../lib/messages'
import { HmsSearchInput, Query } from '@island.is/api/schema'

/**
 * GraphQL query to fetch and format address search results.
 */
export const useAddressSearch = (
  setSearchOptions: (options: any[]) => void,
  setAddressSearchError: (error: string | null) => void,
  setPropertiesByAddressCode: (properties: any) => void,
) => {
  const { formatMessage } = useLocale()

  const [hmsSearch, { loading: searchLoading }] = useLazyQuery<
    Query,
    { input: HmsSearchInput }
  >(ADDRESS_SEARCH_QUERY, {
    onError: (error) => {
      console.error('Error fetching address', error)
      setAddressSearchError(
        formatMessage(m.registerProperty.search.addressSearchError) ||
          'Failed to search addresses',
      )
      setPropertiesByAddressCode(undefined)
    },
    onCompleted: (data) => {
      setAddressSearchError(null)
      if (data.hmsSearch) {
        const searchOptions = data.hmsSearch.addresses.map((address) => ({
          ...address,
          label: `${address.address}, ${address.postalCode} ${address.municipalityName}`,
          value: `${address.addressCode}`,
        }))
        setSearchOptions(searchOptions)
      }
    },
  })

  return {
    hmsSearch,
    searchLoading,
  }
}
