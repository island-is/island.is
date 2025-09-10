import { useLazyQuery } from '@apollo/client'
import { useLocale } from '@island.is/localization'
import { PROPERTY_INFO_QUERY } from '../../../graphql/queries'
import { AddressProps } from '../../../shared/types'
import * as m from '../../../lib/messages'
import {
  HmsPropertyInfo,
  HmsPropertyInfoInput,
  Query,
} from '@island.is/api/schema'

/**
 * GraphQL query to fetch and format property info results based on addressCode.
 */
export const usePropertyInfo = (
  id: string,
  storedValue: AddressProps,
  setValue: (id: string, value: AddressProps) => void,
  setPropertiesByAddressCode: (
    properties: Array<HmsPropertyInfo> | undefined,
  ) => void,
  setSelectedAddress: (address: AddressProps | undefined) => void,
  setPropertyInfoError: (error: string | null) => void,
  checkedUnits: Record<string, boolean>,
  numOfRoomsValue: Record<string, number>,
  unitSizeChangedValue: Record<string, number>,
) => {
  const { formatMessage } = useLocale()

  const [hmsPropertyInfo, { loading: propertiesLoading }] = useLazyQuery<
    Query,
    { input: HmsPropertyInfoInput }
  >(PROPERTY_INFO_QUERY, {
    onError: (error) => {
      console.error('Error fetching properties', error)
      setPropertyInfoError(
        formatMessage(m.registerProperty.search.propertyInfoError) ||
          'Failed to fetch properties',
      )
      setPropertiesByAddressCode(undefined)
    },
    onCompleted: (data) => {
      setPropertyInfoError(null)
      if (data.hmsPropertyInfo) {
        setPropertiesByAddressCode(data.hmsPropertyInfo.propertyInfos)
      }

      const propertyValues = data.hmsPropertyInfo?.propertyInfos?.[0]
      if (!propertyValues) {
        setSelectedAddress(undefined)
        setValue(id, {
          ...storedValue,
          propertiesByAddressCode: data?.hmsPropertyInfo?.propertyInfos || [],
        })
        return
      }

      const addressValues = {
        addressCode: propertyValues?.addressCode,
        address: propertyValues?.address,
        municipalityName: propertyValues?.municipalityName,
        municipalityCode: propertyValues?.municipalityCode,
        postalCode: propertyValues?.postalCode,
        landCode: propertyValues?.landCode,
        streetName: undefined,
        streetNumber: undefined,
        label: `${propertyValues?.address}, ${propertyValues?.postalCode} ${propertyValues?.municipalityName}`,
        value: `${propertyValues?.addressCode}`,
      }

      setSelectedAddress(addressValues)

      setValue(id, {
        ...storedValue,
        ...addressValues,
        units: [],
        checkedUnits: checkedUnits,
        numOfRooms: numOfRoomsValue,
        changedValueOfUnitSize: unitSizeChangedValue,
        selectedPropertyCode: storedValue?.selectedPropertyCode,
        propertiesByAddressCode: data?.hmsPropertyInfo?.propertyInfos || [],
      })
    },
  })

  return {
    hmsPropertyInfo,
    propertiesLoading,
  }
}
