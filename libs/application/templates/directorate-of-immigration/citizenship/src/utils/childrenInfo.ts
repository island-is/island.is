import {
  ApplicantChildCustodyInformation,
  ExternalData,
} from '@island.is/application/types'
import { Citizenship } from '../lib/dataSchema'
import { getValueViaPath } from '@island.is/application/core'

export const hasChildren = (externalData: any) => {
  const children = getValueViaPath(
    externalData,
    'childrenCustodyInformation.data',
    [],
  ) as ApplicantChildCustodyInformation[]

  return children && children.length > 0
}

export const getSelectedCustodyChildren = (
  externalData: ExternalData,
  answers: Citizenship,
) => {
  const custodyChildren = getValueViaPath(
    externalData,
    'childrenCustodyInformation.data',
    [],
  ) as ApplicantChildCustodyInformation[]

  const selectedChildren = answers.selectedChildren

  const selectedInCustody =
    !!selectedChildren &&
    selectedChildren.map((sc) => {
      return custodyChildren?.find((cc) => cc.nationalId === sc)
    })

  return selectedInCustody
}
