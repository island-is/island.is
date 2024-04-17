import {
  ApplicantChildCustodyInformation,
  ExternalData,
  Option,
  StaticText,
} from '@island.is/application/types'
import { format } from 'kennitala'
import { HealthInsuranceDeclaration } from '../lib/dataSchema'
import { application as m } from '../lib/messages'
import { NationalRegistrySpouse } from '@island.is/api/schema'

const getChildrenFromExternalData = (externalData: ExternalData) => {
  return externalData?.childrenCustodyInformation
    ?.data as ApplicantChildCustodyInformation[]
}
const getSpouseFromExternalData = (externalData: ExternalData) => {
  return externalData?.nationalRegistrySpouse?.data as NationalRegistrySpouse[]
}

export const getInsuranceStatus = (externalData: ExternalData) => {
  return externalData?.isHealthInsured?.data as boolean
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

export const getSelectedFamiliy = (
  answers: HealthInsuranceDeclaration,
  externalData: ExternalData,
) => {
  const spouse = getSpouseFromExternalData(externalData)
  const children = getChildrenFromExternalData(externalData)
  let selectedFamiliy: StaticText[][] = []

  if (spouse) {
    selectedFamiliy = selectedFamiliy.concat([
      spouse[0].fullName || '',
      spouse[0].nationalId,
      m.overview.familyTableRelationSpuoseText,
    ])
  }
  selectedFamiliy = selectedFamiliy.concat(
    answers.registerPersonsChildrenCheckboxField.map((childNationalId) => {
      const childData = children.find((c) => c.nationalId === childNationalId)
      return [
        childData ? childData.fullName : '',
        childData ? childData.nationalId : '',
        m.overview.familyTableRelationChildText,
      ]
    }),
  )
  return selectedFamiliy
}
