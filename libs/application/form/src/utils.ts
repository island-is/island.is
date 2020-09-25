import {
  DataProviderItem,
  ExternalData,
  FieldTypes,
  FormItemTypes,
  ReviewField,
} from '@island.is/application/template'
import { FormScreen } from './types'

export const getValueViaPath = (
  obj: object,
  path: string,
  defaultValue?: unknown,
) => {
  try {
    const travel = (regexp: RegExp) =>
      String.prototype.split
        .call(path, regexp)
        .filter(Boolean)
        .reduce(
          // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
          // @ts-ignore
          (res, key) => (res !== null && res !== undefined ? res[key] : res),
          obj,
        )
    const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/)
    return result === undefined || result === obj ? defaultValue : result
  } catch (e) {
    return undefined
  }
}

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
