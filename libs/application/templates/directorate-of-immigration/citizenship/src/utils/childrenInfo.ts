import { Application } from '@island.is/application/types'
import { ExternalData } from '../types'
import { Citizenship } from '../lib/dataSchema'

export const hasChildren = (externalData: any) => {
  const children = externalData.childrenCustodyInformation?.data
  return children && children.length > 0
}

export const getSelectedCustodyChildren = (
  externalData: ExternalData,
  answers: Citizenship,
) => {
  const custodyChildren = externalData?.childrenCustodyInformation?.data
  const selectedChildren = answers.selectedChildren

  const selectedInCustody =
    !!selectedChildren &&
    selectedChildren.map((sc) => {
      return custodyChildren?.find((cc) => cc.nationalId === sc)
    })

  return selectedInCustody
}
