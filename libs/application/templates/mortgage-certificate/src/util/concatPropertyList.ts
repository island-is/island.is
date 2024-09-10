import { SelectedProperty } from '../shared'

export const concatPropertyList = (
  propertyList: SelectedProperty[],
  property: SelectedProperty & {
    exists: boolean
    hasKMarking: boolean
  },
): SelectedProperty[] => {
  return propertyList.concat({
    propertyName: property.propertyName,
    propertyNumber: property.propertyNumber,
    propertyType: property.propertyType,
  })
}
