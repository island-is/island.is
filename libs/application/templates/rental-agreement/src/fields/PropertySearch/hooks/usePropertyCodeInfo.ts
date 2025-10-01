import { useLazyQuery } from '@apollo/client'
import { useLocale } from '@island.is/localization'
import { PROPERTY_CODE_INFO_QUERY } from '../../../graphql/queries'
import * as m from '../../../lib/messages'
import { AddressProps } from '../../../shared/types'
import { HmsPropertyInfo } from '@island.is/api/schema'

export const usePropertyCodeInfo = (
  setSearchOptions: (options: Array<AddressProps>) => void,
  setPropertiesByAddressCode: (
    properties: Array<HmsPropertyInfo> | undefined,
  ) => void,
  setPropertyInfoError: (error: string | null) => void,
) => {
  const { formatMessage } = useLocale()

  const [hmsPropertyCodeInfo, { loading: propertycodeLoading }] = useLazyQuery(
    PROPERTY_CODE_INFO_QUERY,
    {
      onError: (error) => {
        console.error('Error fetching properties by fasteignNr', error)
        setPropertyInfoError(
          formatMessage(m.propertySearch.search.propertyInfoError) ||
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
    },
  )

  return {
    hmsPropertyCodeInfo,
    propertycodeLoading,
  }
}
