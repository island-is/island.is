import { MapCaseStatuses } from '../../../types/enums'

const getTagVariants = (status: string) => {
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
