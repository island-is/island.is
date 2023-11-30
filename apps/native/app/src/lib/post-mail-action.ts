import {archivedCache, client} from '../graphql/client';
import {
  ListDocumentFragmentDoc,
  ListDocumentsDocument,
  PostMailActionMutationDocument,
  PostMailActionMutationMutation,
  PostMailActionMutationMutationVariables,
} from '../graphql/types/schema';

export async function toggleAction(
  action: 'archive' | 'unarchive' | 'bookmark' | 'unbookmark',
  messageId: string,
  refetch = false,
) {
  return client.mutate<
    PostMailActionMutationMutation,
    PostMailActionMutationMutationVariables
  >({
    mutation: PostMailActionMutationDocument,
    variables: {
      input: {
        messageId,
        action,
      },
    },
    refetchQueries: refetch ? [ListDocumentsDocument] : undefined,
    update(cache, {data}) {
      const id = cache.identify({
        __typename: 'Document',
        id: messageId,
      });
      const success = data?.postMailAction?.success;
      if (!success) {
        return;
      }
      const flag = action === 'archive' || action === 'bookmark' ? true : false;
      if (action === 'archive' || action === 'unarchive') {
        archivedCache.set(messageId, flag);
      }
      client.cache.updateFragment(
        {
          id,
          fragment: ListDocumentFragmentDoc,
          overwrite: true,
          returnPartialData: true,
        },
        data => ({
          ...data,
          ...(action === 'archive' || action === 'unarchive'
            ? {archived: flag}
            : {}),
          ...(action === 'bookmark' || action === 'unbookmark'
            ? {bookmarked: flag}
            : {}),
        }),
      );
    },
  });
}
