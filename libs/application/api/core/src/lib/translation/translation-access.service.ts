import { ForbiddenException, Injectable } from '@nestjs/common'
import type { User } from '@island.is/auth-nest-tools'
import {
  getAllowedTranslationTypeIds,
  hasGlobalTranslationAccess,
  isTranslationNamespaceAllowed,
  isTranslationTypeIdAllowed,
} from '@island.is/application/utils'

@Injectable()
export class TranslationAccessService {
  assertTypeIdAccess(user: User, typeId: string): void {
    if (!isTranslationTypeIdAllowed(user, typeId)) {
      throw new ForbiddenException(
        'You do not have access to translate this application type',
      )
    }
  }

  assertNamespaceAccess(user: User, namespace: string): void {
    if (!isTranslationNamespaceAllowed(user, namespace)) {
      throw new ForbiddenException(
        'You do not have access to translate this namespace',
      )
    }
  }

  assertGlobalTranslationAccess(user: User): void {
    if (!hasGlobalTranslationAccess(user)) {
      throw new ForbiddenException(
        'You do not have access to manage shared translation namespaces',
      )
    }
  }

  filterTypeIds(user: User, typeIds: string[]): string[] {
    const allowed = getAllowedTranslationTypeIds(user)

    if (allowed === null) {
      return typeIds
    }

    const allowedSet = new Set(allowed)
    return typeIds.filter((typeId) => allowedSet.has(typeId))
  }

  filterNamespaces(user: User, namespaces: string[]): string[] {
    return namespaces.filter((namespace) =>
      isTranslationNamespaceAllowed(user, namespace),
    )
  }
}
