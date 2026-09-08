import {
  ApplicationConfigurations,
  ApplicationTypes,
} from '@island.is/application/types'
import { useNamespaces } from '@island.is/localization'

/**
 * Local copy of the `@island.is/application/ui-shell` hook. Importing it from
 * that barrel pulls in `ApplicationForm` → `template-loader` → every
 * application template, which dwarfs the SDF renderer's own module graph.
 */
export const useApplicationNamespaces = (type?: ApplicationTypes) => {
  const namespaces = [
    'application.system',
    type ? ApplicationConfigurations?.[type]?.translation ?? null : null,
  ]
    .flat(1)
    .filter((namespace): namespace is string => namespace !== null)

  useNamespaces(namespaces)
}
