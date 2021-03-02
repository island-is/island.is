import {
  ApplicationTypes,
  ApplicationTranslations,
} from '@island.is/application/core'

import { useNamespaces } from './useNamespaces'

export const useApplicationNamespaces = (type: ApplicationTypes) => {
  const array = ['application.system', ApplicationTranslations?.[type] ?? null]
  const filtered = array.filter(
    (namespace): namespace is string => namespace !== null,
  )

  useNamespaces(filtered)
}
