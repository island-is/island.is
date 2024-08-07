import { FormatMessage } from '@island.is/application/types'
import { PropertyTypes } from '../lib/constants'
import { propertySearch } from '../lib/messages'

export const getPropertySelectOptions = (
  formatMessage: FormatMessage,
  allowVehicle: boolean,
  allowShip: boolean,
): { label: string; value: PropertyTypes }[] => {
  return allowVehicle && allowShip
    ? [
        {
          label: formatMessage(
            propertySearch.propertyTypes[PropertyTypes.REAL_ESTATE],
          ),
          value: PropertyTypes.REAL_ESTATE,
        },
        {
          label: formatMessage(
            propertySearch.propertyTypes[PropertyTypes.VEHICLE],
          ),
          value: PropertyTypes.VEHICLE,
        },
        {
          label: formatMessage(
            propertySearch.propertyTypes[PropertyTypes.SHIP],
          ),
          value: PropertyTypes.SHIP,
        },
      ]
    : !allowVehicle && allowShip
    ? [
        {
          label: formatMessage(
            propertySearch.propertyTypes[PropertyTypes.REAL_ESTATE],
          ),
          value: PropertyTypes.REAL_ESTATE,
        },
        {
          label: formatMessage(
            propertySearch.propertyTypes[PropertyTypes.SHIP],
          ),
          value: PropertyTypes.SHIP,
        },
      ]
    : allowVehicle && !allowShip
    ? [
        {
          label: formatMessage(
            propertySearch.propertyTypes[PropertyTypes.REAL_ESTATE],
          ),
          value: PropertyTypes.REAL_ESTATE,
        },
        {
          label: formatMessage(
            propertySearch.propertyTypes[PropertyTypes.VEHICLE],
          ),
          value: PropertyTypes.VEHICLE,
        },
      ]
    : [
        {
          label: formatMessage(
            propertySearch.propertyTypes[PropertyTypes.REAL_ESTATE],
          ),
          value: PropertyTypes.REAL_ESTATE,
        },
      ]
}
