import { useLazyQuery } from '@apollo/client'
import { HmsPropertyCodeInfoInput } from '@island.is/api/schema'
import { useLocale } from '@island.is/localization'
import { PROPERTY_CODE_INFO_QUERY } from '../../../graphql/queries'
import { Query } from '../../../types/schema'
import * as m from '../../../lib/messages'

export const usePropertyCodeInfo = (
  setSearchOptions: (options: any[]) => void,
  setPropertiesByAddressCode: (properties: any) => void,
  setPropertyInfoError: (error: string | null) => void,
) => {
  const { formatMessage } = useLocale()

  const [hmsPropertyCodeInfo, { loading: propertycodeLoading }] = useLazyQuery<
    Query,
    { input: HmsPropertyCodeInfoInput }
  >(PROPERTY_CODE_INFO_QUERY, {
    onError: (error) => {
      console.error('Error fetching properties by fasteignNr', error)
      setPropertyInfoError(
        formatMessage(m.registerProperty.search.propertyInfoError) ||
          'Failed to fetch properties',
      )
      setPropertiesByAddressCode(undefined)
    },
    onCompleted: (data) => {
      if (data.hmsPropertyCodeInfo) {
        const propertyInfo = data.hmsPropertyCodeInfo.address
        const searchOptions = {
          ...propertyInfo,
          label: propertyInfo?.address || '',
          value: propertyInfo?.addressCode?.toString() || '',
        }
        setSearchOptions([searchOptions])
      }
    },
  })

  return {
    hmsPropertyCodeInfo,
    propertycodeLoading,
  }
}
