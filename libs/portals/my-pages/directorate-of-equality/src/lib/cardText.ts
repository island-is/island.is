import {
  DirectorateOfEqualityApiKey,
  DirectorateOfEqualityServiceProvider,
} from '@island.is/api/schema'
import { FormatMessage } from '@island.is/localization'
import { formatDate, formatNationalId } from '@island.is/portals/my-pages/core'

import { getApiKeyState } from './apiKeys'
import { messages } from './messages'

export const getServiceProviderCardText = (
  provider: Pick<
    DirectorateOfEqualityServiceProvider,
    'nationalId' | 'grantedAt' | 'grantedByName'
  >,
  formatMessage: FormatMessage,
) => ({
  text: formatMessage(messages.nationalIdLine, {
    nationalId: formatNationalId(provider.nationalId),
  }),
  subText: formatMessage(messages.grantedByLine, {
    date: formatDate(provider.grantedAt),
    name: provider.grantedByName ?? '–',
  }),
})

export const getApiKeyCardText = (
  apiKey: Pick<
    DirectorateOfEqualityApiKey,
    | 'createdAt'
    | 'createdByDirectorate'
    | 'createdByName'
    | 'expiresAt'
    | 'lastUsedAt'
    | 'revokedAt'
  >,
  formatMessage: FormatMessage,
) => {
  const lastUsed = apiKey.lastUsedAt
    ? formatDate(apiKey.lastUsedAt)
    : formatMessage(messages.keyNeverUsed)

  return {
    text: formatMessage(messages.keyCreatedLine, {
      date: formatDate(apiKey.createdAt),
      createdBy: apiKey.createdByDirectorate
        ? formatMessage(messages.keyCreatedByDoe)
        : apiKey.createdByName ?? '–',
    }),
    subText:
      getApiKeyState(apiKey) === 'revoked'
        ? formatMessage(messages.keyRevokedLine, {
            date: formatDate(apiKey.revokedAt),
            lastUsed,
          })
        : formatMessage(messages.keyValidLine, {
            date: apiKey.expiresAt
              ? formatDate(apiKey.expiresAt)
              : formatMessage(messages.keyNoExpiry),
            lastUsed,
          }),
  }
}
