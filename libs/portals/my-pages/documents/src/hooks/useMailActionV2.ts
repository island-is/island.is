import { useState } from 'react'
import { toast } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '@island.is/portals/my-pages/core'
import { useMailActionV2Mutation } from '../queries/Overview.generated'
import { MailActions } from '../utils/types'
import { useDocumentList } from './useDocumentList'
import { messages as docMessages } from '../utils/messages'
import { useDocumentContext } from '../screens/Overview/DocumentContext'

export const useMailAction = () => {
  const { formatMessage } = useLocale()
  const { fetchObject, refetch, invalidateCache } = useDocumentList()
  const { setPage, setSelectedLines } = useDocumentContext()

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

  const submitBatchAction = async (
    action: MailActions,
    messages: string[],
    /**
     * Have all lines been selected?
     */
    selectedAllOnPage?: boolean,
  ) => {
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
            if (action === 'archive') {
              toast.success(formatMessage(docMessages.successArchiveMulti))
            }
            if (refetch) {
              const currentPage = fetchObject.input.page
              const prevPage = currentPage > 1 ? currentPage - 1 : 1
              const fetchPage = selectedAllOnPage ? prevPage : currentPage

              if (selectedAllOnPage) {
                invalidateCache()
                refetch({
                  input: {
                    ...fetchObject.input,
                    page: fetchPage,
                  },
                }).finally(() => setPage(fetchPage))
              } else {
                refetch(fetchObject)
              }
              setSelectedLines([])
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
