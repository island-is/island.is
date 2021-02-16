import {
  ApplicationTypes,
  ApplicationTranslations,
} from '@island.is/application/core'

import { useNamespaces } from './useNamespaces'

export const useApplicationNamespaces = (type: ApplicationTypes) => {
  useNamespaces(['application.system', ApplicationTranslations?.[type] ?? null])
}
