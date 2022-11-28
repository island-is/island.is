import { FilterProps } from '@island.is/island-ui/core'

export const filterProps = (clearFilter: () => void) => {
  let prop: FilterProps = {
    labelClear: 'Hreinsa',
    labelClearAll: 'Hreinsa allar síur',
    labelOpen: 'Opna',
    labelClose: 'Loka',
    labelResult: 'Niðurstöður',
    labelTitle: 'Titill',
    onFilterClear: clearFilter,
  }
  return prop
}
