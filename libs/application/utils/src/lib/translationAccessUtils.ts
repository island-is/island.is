import { ApplicationConfigurations } from '@island.is/application/types'
import { AdminPortalScope } from '@island.is/auth/scopes'

import { getTypeIdsForInstitution } from './institutionUtils'

export const CORE_TRANSLATION_NAMESPACE = 'application.system'

export interface SharedTranslationNamespaceInfo {
  namespace: string
  usedByCount: number
  usedByTypeIds: string[]
}

export interface TranslationAccessContext {
  nationalId: string
  scope: string[]
  actor?: { scope: string[] }
}

const GLOBAL_TRANSLATION_SCOPES: string[] = [
  AdminPortalScope.applicationSystemAdmin,
]

/**
 * Merges token scopes with actor (delegation) scopes so a super admin acting on
 * behalf of an institution keeps global translation access from their own scopes.
 */
export const getEffectiveTranslationScopes = (
  user: TranslationAccessContext,
): string[] => {
  const scopes = [...(user.scope ?? [])]
  if (user.actor?.scope) {
    for (const scope of user.actor.scope) {
      if (!scopes.includes(scope)) {
        scopes.push(scope)
      }
    }
  }
  return scopes
}

export const hasGlobalTranslationAccess = (
  user: TranslationAccessContext,
): boolean => {
  const scopes = getEffectiveTranslationScopes(user)
  return GLOBAL_TRANSLATION_SCOPES.some((scope) => scopes.includes(scope))
}

export const getTypeIdsForNamespace = (namespace: string): string[] => {
  const typeIds: string[] = []

  for (const [typeId, config] of Object.entries(ApplicationConfigurations)) {
    const namespaces = Array.isArray(config.translation)
      ? config.translation
      : [config.translation]

    if (namespaces.includes(namespace)) {
      typeIds.push(typeId)
    }
  }

  return typeIds
}

/**
 * Returns null when the user has global translation access (all type IDs allowed).
 * Otherwise returns the type IDs mapped to the user's institution nationalId.
 */
export const getAllowedTranslationTypeIds = (
  user: TranslationAccessContext,
): string[] | null => {
  if (hasGlobalTranslationAccess(user)) {
    return null
  }

  return getTypeIdsForInstitution(user.nationalId)
}

export const isTranslationTypeIdAllowed = (
  user: TranslationAccessContext,
  typeId: string,
): boolean => {
  const allowed = getAllowedTranslationTypeIds(user)

  if (allowed === null) {
    return true
  }

  return allowed.includes(typeId)
}

export const isTranslationNamespaceAllowed = (
  user: TranslationAccessContext,
  namespace: string,
): boolean => {
  const allowed = getAllowedTranslationTypeIds(user)

  if (allowed === null) {
    return true
  }

  const owningTypeIds = getTypeIdsForNamespace(namespace)
  return owningTypeIds.some((typeId) => allowed.includes(typeId))
}

const getAllConfiguredTranslationNamespaces = (): string[] => {
  const namespaces = new Set<string>()

  for (const config of Object.values(ApplicationConfigurations)) {
    const configuredNamespaces = Array.isArray(config.translation)
      ? config.translation
      : [config.translation]

    for (const namespace of configuredNamespaces) {
      namespaces.add(namespace)
    }
  }

  return [...namespaces]
}

/** All Contentful-style namespaces used by application templates (from ApplicationConfigurations). */
export const getApplicationTranslationNamespaceSet = (): Set<string> => {
  const namespaces = new Set<string>([CORE_TRANSLATION_NAMESPACE])

  for (const namespace of getAllConfiguredTranslationNamespaces()) {
    namespaces.add(namespace)
  }

  return namespaces
}

export const getSharedTranslationNamespaces =
  (): SharedTranslationNamespaceInfo[] => {
    const sharedNamespaces = new Map<string, SharedTranslationNamespaceInfo>()

    sharedNamespaces.set(CORE_TRANSLATION_NAMESPACE, {
      namespace: CORE_TRANSLATION_NAMESPACE,
      usedByCount: 0,
      usedByTypeIds: [],
    })

    for (const namespace of getAllConfiguredTranslationNamespaces()) {
      const usedByTypeIds = getTypeIdsForNamespace(namespace)
      if (usedByTypeIds.length < 2) {
        continue
      }

      sharedNamespaces.set(namespace, {
        namespace,
        usedByCount: usedByTypeIds.length,
        usedByTypeIds,
      })
    }

    return [...sharedNamespaces.values()].sort((a, b) =>
      a.namespace.localeCompare(b.namespace),
    )
  }

export const isSharedTranslationNamespace = (namespace: string): boolean =>
  getSharedTranslationNamespaces().some(
    (entry) => entry.namespace === namespace,
  )

/** Encodes namespace for URL path segments (dots are not encoded by encodeURIComponent). */
export const encodeTranslationNamespaceForUrlPath = (
  namespace: string,
): string => encodeURIComponent(namespace).replace(/\./g, '%2E')
