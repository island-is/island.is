import {gql, useMutation} from '@apollo/client';
import {useState} from 'react';
import {Alert} from 'react-native';
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

export const useSubmitMailAction = (input?: {messageId: string}) => {
  const [postMailAction, {data, loading}] = useMutation(POST_MAIL_ACTION, {
    client,
  });

  const [bookmarkSuccess, setBookmarkSuccess] = useState(false);
  const [archiveSuccess, setArchiveSuccess] = useState(false);
  const [dataSuccess, setDataSuccess] = useState({
    bookmark: false,
    unbookmark: false,
    unarchive: false,
    archive: false,
  });

  const submitMailAction = async (action: MailActions) => {
    try {
      await postMailAction({
        variables: {
          input: {
            messageId: input?.messageId,
            action,
          },
        },
        update(cache, {data}) {
          const success = data?.postMailAction?.success;
          const id = cache.identify({
            __typename: 'Document',
            id: input?.messageId,
          });
          const flag =
            action === 'archive' || action === 'bookmark' ? true : false;
        },
      }).then(d => {
        const actionName = d.data?.postMailAction?.action as MailActions;

        if (!d.data?.postMailAction?.success) {
          Alert.alert('Villa kom upp');
          return;
        }

        if (actionName === 'bookmark') {
          setBookmarkSuccess(true);
          setDataSuccess({
            ...dataSuccess,
            bookmark: true,
          });
        }
        if (actionName === 'unbookmark') {
          setBookmarkSuccess(false);
          setDataSuccess({
            ...dataSuccess,
            unbookmark: true,
          });
        }
        if (actionName === 'archive') {
          setArchiveSuccess(true);
          setDataSuccess({
            ...dataSuccess,
            archive: true,
          });
        }
        if (actionName === 'unarchive') {
          setArchiveSuccess(false);
          setDataSuccess({
            ...dataSuccess,
            unarchive: true,
          });
        }
      });
    } catch (err) {
      Alert.alert('Villa kom upp');
    }
  };

  return {
    data,
    submitMailAction,
    loading,
    archiveSuccess,
    bookmarkSuccess,
    dataSuccess,
  };
};

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
      // Hack for now
      if (action === 'archive' || action === 'unarchive') {
        archivedCache.set(messageId, flag);
      }
      console.log('updated fragment!!', action, flag);
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

  // await postMailAction({
  //   variables: {
  //     input: {
  //       messageId: input?.messageId,
  //       action,
  //     },
  //   },
  //   update(cache, {data}) {
  //     const success = data?.postMailAction?.success;
  //     const id = cache.identify({
  //       __typename: 'Document',
  //       id: input?.messageId,
  //     });
  //     const flag = (action === 'archive' || action === 'bookmark') ? true : false;
  //     if (action === 'archive' || action === 'unarchive') {
  //       cache.modify({
  //         id,
  //         fields: {
  //           archived: () => success ? flag : ,
  //         }
  //       })
  //   }
}
