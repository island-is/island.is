import { Box, Text, SkeletonLoader, GridContainer } from '@island.is/island-ui/core'
import type { ApolloError } from '@apollo/client'

export const TranslationWorkspaceLoading = () => (
  <GridContainer>
    <Box marginTop={4}>
      <SkeletonLoader height={400} />
    </Box>
  </GridContainer>
)

export const TranslationWorkspaceError = ({
  loadError,
}: {
  loadError: ApolloError
}) => {
  const fromGraphQl = loadError.graphQLErrors
    ?.map((e) => e.message)
    .filter(Boolean)
    .join('\n')
  const fromNetwork =
    loadError.networkError instanceof Error
      ? loadError.networkError.message
      : loadError.networkError
      ? String(loadError.networkError)
      : ''
  const detailMessage =
    fromGraphQl || fromNetwork || loadError.message || 'Unknown error'

  return (
    <GridContainer>
      <Box marginTop={4}>
        <Text variant="h4" color="red600">
          Error loading template
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
