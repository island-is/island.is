import {
  Box,
  Text,
  SkeletonLoader,
  GridContainer,
} from '@island.is/island-ui/core'
import type { ApolloError } from '@apollo/client'
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

export const TranslationWorkspaceNotFound = () => (
  <GridContainer>
    <Box marginTop={4}>
      <Text>Template not found</Text>
    </Box>
  </GridContainer>
)
