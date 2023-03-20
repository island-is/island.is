import { ExternalData } from '@island.is/application/templates/family-matters-core/types'

export const hasChildren = (externalData: ExternalData) => {
  const children = externalData.childrenCustodyInformation?.data
  return children && children.length > 0
}
