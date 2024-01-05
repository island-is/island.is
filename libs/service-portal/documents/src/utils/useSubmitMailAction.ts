import { gql, useMutation } from '@apollo/client'
import { MailActions } from './types'
import { useState } from 'react'
import { toast } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '@island.is/service-portal/core'

const POST_MAIL_ACTION = gql`
  mutation PostMailActionMutation($input: PostMailActionResolverInput!) {
    postMailAction(input: $input) {
      success
      messageId
      action
    }
  }
`

export const useSubmitMailAction = (input?: { messageId: string }) => {
  const { formatMessage } = useLocale()
  const [postMailAction, { data, loading }] = useMutation(POST_MAIL_ACTION)

  const [bookmarkSuccess, setBookmarkSuccess] = useState(false)
  const [archiveSuccess, setArchiveSuccess] = useState(false)
  const [dataSuccess, setDataSuccess] = useState({
    bookmark: false,
    unbookmark: false,
    unarchive: false,
    archive: false,
  })

  const submitMailAction = async (action: MailActions) => {
    try {
      await postMailAction({
        variables: {
          input: {
            messageId: input?.messageId,
            action,
          },
        },
      }).then((d) => {
        const actionName = d.data?.postMailAction?.action as MailActions

        if (!d.data?.postMailAction?.success) {
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
          setDataSuccess({
            ...dataSuccess,
            archive: true,
          })
        }
        if (actionName === 'unarchive') {
          setArchiveSuccess(false)
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

  return {
    data,
    submitMailAction,
    loading,
    archiveSuccess,
    bookmarkSuccess,
    dataSuccess,
  }
}
