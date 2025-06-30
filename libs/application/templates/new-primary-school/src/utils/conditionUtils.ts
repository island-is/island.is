import { ExternalData } from '@island.is/application/types'
import { getApplicationExternalData } from '../lib/newPrimarySchoolUtils'

export const isCurrentShoolRegisterd = (externalData: ExternalData) => {
  const { primaryOrgId } = getApplicationExternalData(externalData)
  return !!primaryOrgId
}
