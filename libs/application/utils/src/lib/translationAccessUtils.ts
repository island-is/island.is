import { ApplicationConfigurations } from '@island.is/application/types'
import { AdminPortalScope } from '@island.is/auth/scopes'

import { getTypeIdsForInstitution } from './institutionUtils'

export const CORE_TRANSLATION_NAMESPACE = 'application.system'

/** Matches `application_translation.namespace` STRING(255). */
export const TRANSLATION_NAMESPACE_MAX_LENGTH = 255
/** Matches `application_translation.message_key` STRING(512). */
export const TRANSLATION_MESSAGE_KEY_MAX_LENGTH = 512
export const TRANSLATION_BULK_MAX_ITEMS = 500

export interface SharedTranslationNamespaceInfo {
  namespace: string
  usedByCount: number
  usedByTypeIds: string[]
}

export interface TranslationAccessContext {
  nationalId: string
  scope: string[]
}

const GLOBAL_TRANSLATION_SCOPES: string[] = [
  AdminPortalScope.applicationSystemAdmin,
]

/**
 * Uses the token's subject scopes only. Actor (delegation) scopes are ignored so
 * a super admin acting as an institution is narrowed to that institution.
 */
export const hasGlobalTranslationAccess = (
  user: TranslationAccessContext,
): boolean => {
  const scopes = user.scope ?? []
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

/**
 * Returns null when the user has global translation access (all namespaces).
 * Otherwise returns configured namespaces the user's institution may read.
 */
export const getAllowedTranslationNamespaces = (
  user: TranslationAccessContext,
): string[] | null => {
  if (hasGlobalTranslationAccess(user)) {
    return null
  }

  return getAllConfiguredTranslationNamespaces().filter((namespace) =>
    isTranslationNamespaceAllowed(user, namespace),
  )
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

/**
 * Namespaces that belong to a single application. Shared namespaces
 * (`uiForms.application`, `sia.application`, `application.system`, …) are
 * translated in the shared-namespace workspace instead.
 *
 * If every configured namespace is shared, the original list is returned so
 * the application workspace is not left empty.
 */
export const getOwnedTranslationNamespaces = (
  namespaces: readonly string[],
): string[] => {
  const unique = [...new Set(namespaces.filter(Boolean))]
  const shared = new Set(
    getSharedTranslationNamespaces().map((entry) => entry.namespace),
  )
  const owned = unique.filter((namespace) => !shared.has(namespace))
  return owned.length > 0 ? owned : unique
}

export const isOwnedTranslationMessageId = (
  messageId: string,
  ownedNamespaces: readonly string[],
): boolean =>
  ownedNamespaces.some((namespace) => messageId.startsWith(`${namespace}:`))

export const filterOwnedTranslationDescriptors = <T extends { id: string }>(
  descriptors: readonly T[],
  namespaces: readonly string[],
): T[] => {
  const owned = getOwnedTranslationNamespaces(namespaces)
  if (owned.length === 0) {
    return [...descriptors]
  }
  return descriptors.filter((descriptor) =>
    isOwnedTranslationMessageId(descriptor.id, owned),
  )
}

/** Encodes namespace for URL path segments (dots are not encoded by encodeURIComponent). */
export const encodeTranslationNamespaceForUrlPath = (
  namespace: string,
): string => encodeURIComponent(namespace).replace(/\./g, '%2E')
