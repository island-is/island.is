import {
  ApplicantChildCustodyInformation,
  ExternalData,
  Option,
} from '@island.is/application/types'
import { format } from 'kennitala'

const getChildrenFromExternalData = (externalData: ExternalData) => {
  return externalData?.childrenCustodyInformation
    ?.data as ApplicantChildCustodyInformation[]
}

export const getChildrenAsOptions = (externalData: ExternalData): Option[] => {
  const children = getChildrenFromExternalData(externalData)

  if (children && children.length) {
    return children.map((child) => {
      return {
        value: child.nationalId,
        label: child.fullName,
        subLabel: `${format(child.nationalId)}`,
      }
    })
  }
  return []
}
