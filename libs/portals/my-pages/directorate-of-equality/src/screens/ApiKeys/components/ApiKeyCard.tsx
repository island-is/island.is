import { Box, Button, Tag, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { formatDate, formatNationalId } from '@island.is/portals/my-pages/core'

import { getApiKeyState } from '../../../lib/apiKeys'
import { messages } from '../../../lib/messages'
import {
  DirectorateOfEqualityApiKey,
  DirectorateOfEqualityApiKeyType,
} from '../../../mocks/types'

const TAG_VARIANTS = {
  active: 'mint',
  revoked: 'red',
  expired: 'blue',
} as const

const TAG_MESSAGES = {
  active: messages.keyActive,
  revoked: messages.keyRevoked,
  expired: messages.keyExpired,
} as const

export const ApiKeyCard = ({
  apiKey,
  showType,
  onRevoke,
}: {
  apiKey: DirectorateOfEqualityApiKey
  showType?: boolean
  onRevoke?: (apiKey: DirectorateOfEqualityApiKey, trigger: HTMLElement) => void
}) => {
  const { formatMessage } = useLocale()
  const state = getApiKeyState(apiKey)
  const title = apiKey.label ?? formatMessage(messages.keyFallbackTitle)
  const lastUsed = apiKey.lastUsedAt
    ? formatDate(apiKey.lastUsedAt)
    : formatMessage(messages.keyNeverUsed)
  const isServiceProviderKey =
    apiKey.type === DirectorateOfEqualityApiKeyType.SERVICE_PROVIDER

  return (
    <Box
      border="standard"
      borderColor="blue200"
      borderRadius="large"
      padding={3}
    >
      <Box
        display="flex"
        justifyContent="spaceBetween"
        alignItems="flexStart"
        columnGap={2}
      >
        <Text variant="h5" as="h3">
          {title}
        </Text>
        <Box
          display="flex"
          columnGap={1}
          flexWrap="wrap"
          justifyContent="flexEnd"
        >
          {(showType || isServiceProviderKey) && (
            <Tag variant="purple" outlined disabled>
              {formatMessage(
                isServiceProviderKey
                  ? messages.keyTypeServiceProvider
                  : messages.keyTypeCompany,
              )}
            </Tag>
          )}
          <Tag variant={TAG_VARIANTS[state]} outlined disabled>
            {formatMessage(TAG_MESSAGES[state])}
          </Tag>
        </Box>
      </Box>
      <Text marginTop={1}>
        {formatMessage(messages.keyCreatedLine, {
          date: formatDate(apiKey.createdAt),
          createdBy: apiKey.createdByNationalId
            ? formatNationalId(apiKey.createdByNationalId)
            : formatMessage(messages.keyCreatedByDoe),
        })}
      </Text>
      <Box
        display="flex"
        justifyContent="spaceBetween"
        alignItems="flexEnd"
        flexWrap="wrap"
        columnGap={2}
        rowGap={1}
        marginTop={1}
      >
        <Text>
          {state === 'revoked'
            ? formatMessage(messages.keyRevokedLine, {
                date: formatDate(apiKey.revokedAt),
                lastUsed,
              })
            : formatMessage(messages.keyValidLine, {
                date: apiKey.expiresAt
                  ? formatDate(apiKey.expiresAt)
                  : formatMessage(messages.keyNoExpiry),
                lastUsed,
              })}
        </Text>
        {state === 'active' && onRevoke && (
          <Button
            variant="text"
            size="small"
            colorScheme="destructive"
            aria-label={formatMessage(messages.revokeKeyAriaLabel, { title })}
            onClick={(event) => onRevoke(apiKey, event.currentTarget)}
          >
            {formatMessage(messages.revokeKey)}
          </Button>
        )}
      </Box>
    </Box>
  )
}
