import { gql, useMutation } from '@apollo/client'
import { useState } from 'react'
import { toast } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '@island.is/service-portal/core'
import { useMailActionV2Mutation } from '../screens/Overview/Overview.generated'
import { MailActions } from '../utils/types'
import { useDocumentList } from './useDocumentList'
import { messages as docMessages } from '../utils/messages'

export const useMailAction = () => {
  const { formatMessage } = useLocale()
  const { fetchObject, refetch } = useDocumentList()

  const [postMailAction, { data, loading }] = useMailActionV2Mutation()

  const [bookmarkSuccess, setBookmarkSuccess] = useState(false)
  const [archiveSuccess, setArchiveSuccess] = useState(false)
  const [dataSuccess, setDataSuccess] = useState({
    bookmark: false,
    unbookmark: false,
    unarchive: false,
    archive: false,
  })

  const submitMailAction = async (action: MailActions, message: string) => {
    try {
      await postMailAction({
        variables: {
          input: {
            documentIds: [message],
            action,
          },
        },
      }).then((d) => {
        const actionName = action

        if (!d.data?.postMailActionV2?.success) {
          toast.error(formatMessage(m.errorTitle))
          return
        }

        if (actionName === 'bookmark') {
          setBookmarkSuccess(true)
          setDataSuccess({
            ...dataSuccess,
            bookmark: true,
          })
        }
        if (actionName === 'unbookmark') {
          setBookmarkSuccess(false)
          setDataSuccess({
            ...dataSuccess,
            unbookmark: true,
          })
        }
        if (actionName === 'archive') {
          setArchiveSuccess(true)
          toast.success(formatMessage(docMessages.successArchive))
          setDataSuccess({
            ...dataSuccess,
            archive: true,
          })
        }
        if (actionName === 'unarchive') {
          setArchiveSuccess(false)
          toast.success(formatMessage(docMessages.successUnarchive))
          setDataSuccess({
            ...dataSuccess,
            unarchive: true,
          })
        }
      })
    } catch (err) {
      toast.error(formatMessage(m.errorTitle))
    }
  }

  const submitBatchAction = async (action: MailActions, messages: string[]) => {
    try {
      await postMailAction({
        variables: {
          input: {
            documentIds: messages,
            action,
          },
        },
        onError: (_) => toast.error(formatMessage(m.errorTitle)),
        onCompleted: (mData) => {
          if (mData.postMailActionV2?.success) {
            if (refetch) {
              refetch(fetchObject)
            }
            if (action === 'archive') {
              toast.success(formatMessage(docMessages.successArchiveMulti))
            }
          } else {
            toast.error(formatMessage(m.errorTitle))
          }
        },
      })
    } catch (e) {
      toast.error(formatMessage(m.errorTitle))
    }
  }

  return {
    data,
    loading,
    archiveSuccess,
    bookmarkSuccess,
    dataSuccess,

    submitMailAction,
    submitBatchAction,
  }
}
