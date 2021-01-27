import { DictArray } from '@island.is/shared/types'
import isEmpty from 'lodash/isEmpty'

// Local array doesn't contain all the locales translation. We just set the is-IS
// translation using the defaultMessage, the rest has to be done through contentful
export const mergeArray = (
  local: Partial<DictArray>[],
  contentful: DictArray[],
  locales: { id: string }[],
) => [
  ...local.map((localObj) => {
    const contentfulValue = contentful.find(
      (contentfulObj) => contentfulObj.id === localObj.id,
    )

    return {
      id: localObj.id,
      defaultMessage: localObj.defaultMessage,
      description: localObj.description,
      ...locales.reduce((acc, cur) => {
        const contentfulMessage = (contentfulValue as Record<string, any>)?.[
          cur.id
        ]
        const localMessage = (localObj as Record<string, string>)?.[cur.id]
        const message = !isEmpty(contentfulMessage)
          ? contentfulMessage
          : !isEmpty(localMessage)
          ? localMessage
          : ''

        return {
          ...acc,
          [cur.id]: message,
          deprecated: false,
        }
      }, {}),
    }
  }),
  ...contentful
    .filter(
      (contentfulObj) =>
        !local.some((localObj) => localObj.id === contentfulObj.id),
    )
    .map((contentfulObj) => ({
      ...contentfulObj,
      deprecated: true,
    })),
]
