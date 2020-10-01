import {
  DataProviderItem,
  ExternalData,
  FieldTypes,
  FormItemTypes,
  ReviewField,
} from '@island.is/application/core'
import { FormScreen } from './types'

export function verifyExternalData(
  externalData: ExternalData,
  dataProviders: DataProviderItem[],
): boolean {
  for (let i = 0; i < dataProviders.length; i++) {
    const { id } = dataProviders[i]
    const dataProviderResult = externalData[id]
    if (!dataProviderResult || dataProviderResult.status === 'failure') {
      return false
    }
  }
  return true
}

export function findReviewField(screen: FormScreen): ReviewField | undefined {
  if (screen.type === FieldTypes.REVIEW) {
    return screen
  }
  if (screen.type === FormItemTypes.MULTI_FIELD) {
    const reviewScreen = screen.children.find(
      (child) => child.type === FieldTypes.REVIEW,
    )
    if (reviewScreen !== undefined) {
      return reviewScreen as ReviewField
    }
  }
  return undefined
}
