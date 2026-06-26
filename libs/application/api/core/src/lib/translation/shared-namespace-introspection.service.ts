import { Injectable, NotFoundException } from '@nestjs/common'
import {
  coreDefaultFieldMessages,
  coreDelegationsMessages,
  coreErrorMessages,
  coreErrorScreenMessages,
  coreHistoryMessages,
  coreMessages,
  corePendingActionMessages,
} from '@island.is/application/core'
import {
  applicantInformationMessages,
  conclusionMessages,
  paymentChargeOverviewMessages,
} from '@island.is/application/ui-forms'
import {
  errorMessages as siaErrorMessages,
  socialInsuranceAdministrationMessage,
  statesMessages as siaStatesMessages,
} from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import {
  CORE_TRANSLATION_NAMESPACE,
  getSharedTranslationNamespaces,
  isSharedTranslationNamespace,
} from '@island.is/application/utils'
import type { MessageDescriptor } from 'react-intl'

import type { MessageDescriptorInfo } from '@island.is/application/types'

export interface SharedNamespaceIntrospection {
  namespace: string
  messageDescriptors: MessageDescriptorInfo[]
}

const isMessageDescriptor = (value: unknown): value is MessageDescriptor => {
  if (typeof value !== 'object' || value === null || !('id' in value)) {
    return false
  }

  const candidate = value as MessageDescriptor
  return typeof candidate.id === 'string' && 'defaultMessage' in value
}

const flattenMessageDescriptors = (root: unknown): MessageDescriptorInfo[] => {
  const descriptors: MessageDescriptorInfo[] = []
  const seen = new Set<string>()

  const visit = (value: unknown) => {
    if (isMessageDescriptor(value)) {
      const messageId = value.id
      if (typeof messageId !== 'string' || seen.has(messageId)) {
        return
      }

      seen.add(messageId)
      descriptors.push({
        id: messageId,
        defaultMessage:
          typeof value.defaultMessage === 'string'
            ? value.defaultMessage
            : undefined,
        description:
          typeof value.description === 'string' ? value.description : undefined,
      })
      return
    }

    if (typeof value !== 'object' || value === null) {
      return
    }

    for (const nested of Object.values(value)) {
      visit(nested)
    }
  }

  visit(root)
  return descriptors
}

const SHARED_NAMESPACE_MESSAGE_ROOTS: Record<string, unknown[]> = {
  [CORE_TRANSLATION_NAMESPACE]: [
    coreMessages,
    coreDefaultFieldMessages,
    coreErrorMessages,
    coreDelegationsMessages,
    coreErrorScreenMessages,
    coreHistoryMessages,
    corePendingActionMessages,
  ],
  'uiForms.application': [
    conclusionMessages,
    applicantInformationMessages,
    paymentChargeOverviewMessages,
  ],
  'sia.application': [
    socialInsuranceAdministrationMessage,
    siaErrorMessages,
    siaStatesMessages,
  ],
}

const getNamespacePrefix = (namespace: string) => `${namespace}:`

@Injectable()
export class SharedNamespaceIntrospectionService {
  listSharedNamespaces() {
    const introspectableNamespaces = new Set(
      Object.keys(SHARED_NAMESPACE_MESSAGE_ROOTS),
    )

    return getSharedTranslationNamespaces().filter((entry) =>
      introspectableNamespaces.has(entry.namespace),
    )
  }

  introspectSharedNamespace(namespace: string): SharedNamespaceIntrospection {
    if (!isSharedTranslationNamespace(namespace)) {
      throw new NotFoundException(
        `Shared translation namespace not found: ${namespace}`,
      )
    }

    const roots = SHARED_NAMESPACE_MESSAGE_ROOTS[namespace]
    if (!roots) {
      throw new NotFoundException(
        `No message registry configured for shared namespace: ${namespace}`,
      )
    }

    const prefix = getNamespacePrefix(namespace)
    const messageDescriptors = roots
      .flatMap((root) => flattenMessageDescriptors(root))
      .filter((descriptor) => descriptor.id.startsWith(prefix))
      .sort((a, b) => a.id.localeCompare(b.id))

    return {
      namespace,
      messageDescriptors,
    }
  }
}
