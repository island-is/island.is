import { MapCaseStatuses } from '@island.is/consultation-portal/types/enums'

export function getTagVariants(status) {
  switch (status) {
    case MapCaseStatuses['Til umsagnar']:
      return 'purple'
    case MapCaseStatuses['Niðurstöður í vinnslu']:
      return 'darkerBlue'
    case MapCaseStatuses['Niðurstöður birtar']:
      return 'mint'
  }
}
export default getTagVariants
