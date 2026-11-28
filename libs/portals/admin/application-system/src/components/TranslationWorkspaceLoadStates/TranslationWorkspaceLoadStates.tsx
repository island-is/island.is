import {
  AlertMessage,
  Box,
  Text,
  SkeletonLoader,
  GridContainer,
} from '@island.is/island-ui/core'
import type { ApolloError } from '@apollo/client'
import {
  CONTENTFUL_TOKEN_REJECTED_ERROR,
  CONTENTFUL_UNAVAILABLE_ERROR,
} from '@island.is/application/utils'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { getTranslationLoadErrorDetail } from '../../utils/translationWorkspaceErrors'

export const TranslationWorkspaceLoading = () => (
  <GridContainer>
    <Box marginTop={4}>
      <Box marginBottom={3}>
        <SkeletonLoader height={48} borderRadius="large" />
      </Box>
      <Box marginBottom={3}>
        <SkeletonLoader height={38} borderRadius="large" />
      </Box>
      <Box marginBottom={3}>
        <SkeletonLoader height={32} borderRadius="large" />
      </Box>
      <SkeletonLoader height={220} repeat={4} space={3} borderRadius="large" />
    </Box>
  </GridContainer>
)

export const TranslationWorkspaceError = ({
  loadError,
  title = 'Error loading template',
}: {
  loadError: ApolloError | Error
  title?: string
}) => {
  const detailMessage = getTranslationLoadErrorDetail(loadError)

  return (
    <GridContainer>
      <Box marginTop={4}>
        <Text variant="h4" color="red600">
          {title}
        </Text>
        <Text marginTop={1} whiteSpace="preLine">
          {detailMessage}
        </Text>
      </Box>
    </GridContainer>
  )
}

export const TranslationWorkspaceTranslationsWarning = ({
  error,
}: {
  error: ApolloError | Error
}) => {
  const { formatMessage } = useLocale()
  const detail = getTranslationLoadErrorDetail(error)

  const message = detail.includes(CONTENTFUL_TOKEN_REJECTED_ERROR)
    ? formatMessage(m.translationsContentfulTokenRejected)
    : detail.includes(CONTENTFUL_UNAVAILABLE_ERROR)
    ? formatMessage(m.translationsContentfulUnavailable)
    : detail

  return (
    <AlertMessage
      type="warning"
      title={formatMessage(m.translationsLoadFailedTitle)}
      message={message}
    />
  )
}

export const TranslationWorkspaceNotFound = () => (
  <GridContainer>
    <Box marginTop={4}>
      <Text>Template not found</Text>
    </Box>
  </GridContainer>
)
