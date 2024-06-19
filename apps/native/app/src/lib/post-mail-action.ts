import { archivedCache, getApolloClientAsync } from '../graphql/client'
import {
  ListDocumentFragmentDoc,
  ListDocumentsDocument,
  PostMailActionMutationDocument,
  PostMailActionMutationMutation,
  PostMailActionMutationMutationVariables,
} from '../graphql/types/schema'

export async function toggleAction(
  action: 'archive' | 'unarchive' | 'bookmark' | 'unbookmark',
  messageId: string,
  refetch = false,
) {
  const client = await getApolloClientAsync()

  return client.mutate<
    PostMailActionMutationMutation,
    PostMailActionMutationMutationVariables
  >({
    mutation: PostMailActionMutationDocument,
    variables: {
      input: {
        documentIds: [messageId],
        action,
      },
    },
    refetchQueries: refetch ? [ListDocumentsDocument] : undefined,
    update(cache, { data }) {
      const id = cache.identify({
        __typename: 'DocumentV2',
        id: messageId,
      })

      const success = data?.postMailActionV2?.success
      if (!success) {
        return
      }
      const flag = action === 'archive' || action === 'bookmark' ? true : false
      if (action === 'archive' || action === 'unarchive') {
        archivedCache.set(messageId, flag)
      }
      client.cache.updateFragment(
        {
          id,
          fragment: ListDocumentFragmentDoc,
          overwrite: true,
          returnPartialData: true,
        },
        (data) => ({
          ...data,
          ...(action === 'archive' || action === 'unarchive'
            ? { archived: flag }
            : {}),
          ...(action === 'bookmark' || action === 'unbookmark'
            ? { bookmarked: flag }
            : {}),
        }),
      )
    },
  })
}
