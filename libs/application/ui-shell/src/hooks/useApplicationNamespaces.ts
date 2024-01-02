import {
  ApplicationConfigurations,
  ApplicationTypes,
} from '@island.is/application/types'
import { useNamespaces } from '@island.is/localization'

export const useApplicationNamespaces = (type?: ApplicationTypes) => {
  const array = [
    'application.system',
    type ? ApplicationConfigurations?.[type]?.translation ?? null : null,
  ]

  const filtered = array
    .flat(1)
    .filter((namespace): namespace is string => namespace !== null)

  useNamespaces(filtered)
}
