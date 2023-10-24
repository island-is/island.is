import {gql} from '@apollo/client';
import {archivedCache, client} from '../client';
import {
  LIST_DOCUMENTS_QUERY,
  LIST_DOCUMENT_FRAGMENT,
} from './list-documents.query';

export type MailActions = 'archive' | 'unarchive' | 'bookmark' | 'unbookmark';

export const POST_MAIL_ACTION = gql`
  mutation PostMailActionMutation($input: PostMailActionResolverInput!) {
    postMailAction(input: $input) {
      success
      messageId
      action
    }
  }
`;

export async function toggleAction(
  action: 'archive' | 'unarchive' | 'bookmark' | 'unbookmark',
  messageId: string,
  refetch = false,
) {
  return client.mutate({
    mutation: POST_MAIL_ACTION,
    variables: {
      input: {
        messageId,
        action,
      },
    },
    refetchQueries: refetch ? [LIST_DOCUMENTS_QUERY] : undefined,
    update(cache, {data}) {
      const id = cache.identify({
        __typename: 'Document',
        id: messageId,
      });
      const success = data.postMailAction.success;
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
          fragment: LIST_DOCUMENT_FRAGMENT,
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
