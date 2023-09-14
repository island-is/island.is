import {
  ApplicantChildCustodyInformation,
  ExternalData,
  FormValue,
} from '@island.is/application/types'
import { Citizenship } from '../lib/dataSchema'
import { getValueViaPath } from '@island.is/application/core'

export const hasChildren = (externalData: ExternalData): boolean => {
  const children = getValueViaPath(
    externalData,
    'childrenCustodyInformation.data',
    [],
  ) as ApplicantChildCustodyInformation[]

  return children && children.length > 0
}

export const getSelectedCustodyChildren = (
  externalData: ExternalData,
  answers: FormValue,
): ApplicantChildCustodyInformation[] | undefined => {
  const custodyChildren = getValueViaPath(
    externalData,
    'childrenCustodyInformation.data',
    [],
  ) as ApplicantChildCustodyInformation[]

  const selectedChildren = (answers as Citizenship).selectedChildren

  if (!selectedChildren) return []

  return selectedChildren.map((sc) => {
    return custodyChildren.find((cc) => cc.nationalId === sc)!
  })
}

export const getSelectedCustodyChild = (
  externalData: ExternalData,
  answers: FormValue,
  sectionIndex: number,
): ApplicantChildCustodyInformation | undefined => {
  const custodyChildren = getValueViaPath(
    externalData,
    'childrenCustodyInformation.data',
    undefined,
  ) as ApplicantChildCustodyInformation[] | undefined

  const childInfo = custodyChildren && custodyChildren[sectionIndex]
  const childNationalId = childInfo?.nationalId

  const selectedChildren = (answers as Citizenship).selectedChildren
  const isSelected =
    selectedChildren && selectedChildren.find((x) => x === childNationalId)

  return isSelected ? childInfo : undefined
}
