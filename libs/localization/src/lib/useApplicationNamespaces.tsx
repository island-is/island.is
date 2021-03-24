import {
  ApplicationTypes,
  ApplicationConfigurations,
} from '@island.is/application/core'

import { useNamespaces } from './useNamespaces'

export const useApplicationNamespaces = (type?: ApplicationTypes) => {
  const array = [
    'application.system',
    type ? ApplicationConfigurations?.[type]?.translation ?? null : null,
  ]

  const filtered = array.filter(
    (namespace): namespace is string => namespace !== null,
  )

  useNamespaces(filtered)
}
