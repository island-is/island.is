import {
  Box,
  Button,
  Input,
  LoadingDots,
  toast,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useIsMobile } from '@island.is/portals/my-pages/core'
import { useUserProfile } from '@island.is/portals/my-pages/graphql'
import { useUserInfo } from '@island.is/react-spa/bff'
import React, { useCallback, useMemo } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { useGetDocumentTicketLazyQuery } from '../../queries/Overview.generated'
import { useReplyMutation } from '../../queries/Reply.generated'
import { useDocumentContext } from '../../screens/Overview/DocumentContext'
import { messages } from '../../utils/messages'
import * as styles from './Reply.css'

interface Props {
  hasEmail: boolean
  successfulSubmit: () => void
}

interface FormData {
  reply: string
}

const MAX_REPLY_LENGTH = 500
const MIN_REPLY_LENGTH = 1

const ReplyForm: React.FC<Props> = ({ successfulSubmit }) => {
  const methods = useForm<FormData>({
    defaultValues: {
      reply: '',
    },
    mode: 'onChange',
  })

  const { activeDocument, setReplyState } = useDocumentContext()
  const { data: userProfile } = useUserProfile()
  const { profile } = useUserInfo()
  const { formatMessage } = useLocale()
  const { isMobile } = useIsMobile()

  // Memoize derived values to prevent unnecessary re-renders
  const documentId = useMemo(
    () => activeDocument?.id ?? '',
    [activeDocument?.id],
  )

  const userName = useMemo(() => profile?.name ?? '', [profile?.name])
  const userEmail = profile?.email ?? userProfile?.email

  const [getTicketQuery, { data, loading, refetch }] =
    useGetDocumentTicketLazyQuery({
      variables: {
        input: {
          id: documentId,
          includeDocument: true,
        },
      },
      fetchPolicy: 'no-cache',
    })

  const handleReplySuccess = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (response: any) => {
      if (!response?.documentsV2Reply?.id) {
        toast.error(formatMessage(messages.replySentError))
        return
      }

      try {
        const ticketResponse = await getTicketQuery()
        const ticketData = ticketResponse?.data?.documentV2?.ticket

        if (!ticketData) {
          toast.error(formatMessage(messages.replySentError))
          return
        }

        const replyValue = methods.getValues('reply')
        if (!replyValue?.trim()) {
          toast.error(formatMessage(messages.replySentError))
          return
        }

        setReplyState((prev) => ({
          ...prev,
          sentReply: {
            id: response.documentsV2Reply.id,
            email: response.documentsV2Reply.email ?? '',
            body: replyValue,
          },
          replies: {
            authorId: ticketData.authorId ?? '',
            comments: ticketData.comments ?? [],
            status: ticketData.status ?? '',
            id: ticketData.id ?? '',
            createdDate: ticketData.createdDate ?? '',
            subject: ticketData.subject ?? '',
            updatedDate: ticketData.updatedDate ?? '',
          },
        }))

        toast.success(formatMessage(messages.replySentShort))
        methods.reset()
        successfulSubmit()
      } catch (error) {
        console.error('Error updating reply state:', error)
        toast.error(formatMessage(messages.replySentError))
      }
    },
    [getTicketQuery, setReplyState, methods, formatMessage, successfulSubmit],
  )

  const handleReplyError = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (error: any) => {
      console.error('Reply mutation error:', error)
      toast.error(formatMessage(messages.replySentError))
    },
    [formatMessage],
  )

  const [postReply, { loading: postReplyLoading }] = useReplyMutation({
    onError: handleReplyError,
    onCompleted: handleReplySuccess,
  })

  const validateReply = useCallback(
    (reply: string): string | undefined => {
      if (!reply?.trim()) {
        return formatMessage(messages.replyCannotBeEmpty)
      }
      if (reply.trim().length < MIN_REPLY_LENGTH) {
        return formatMessage(messages.replyCannotBeEmpty)
      }
      if (reply.length > MAX_REPLY_LENGTH) {
        return formatMessage(messages.replyCannotBeMore)
      }
      return undefined
    },
    [formatMessage],
  )

  const handleSubmitForm = useCallback(
    (data: FormData) => {
      const validationError = validateReply(data.reply)
      if (validationError) {
        methods.setError('reply', { message: validationError })
        return
      }

      if (!documentId) {
        console.error('Document ID is missing')
        toast.error(formatMessage(messages.replySentError))
        return
      }

      if (!userEmail) {
        console.error('User email is missing')
        methods.setError('reply', {
          message: formatMessage(messages.emailMissing),
        })

        return
      }

      postReply({
        variables: {
          input: {
            documentId,
            body: data.reply.trim(),
            requesterEmail: userEmail,
            subject: activeDocument?.subject ?? '',
            requesterName: userName,
          },
        },
      }).catch((error) => {
        console.error('Failed to submit reply:', error)
        toast.error(formatMessage(messages.replySentError))
      })
    },
    [
      validateReply,
      documentId,
      userEmail,
      userName,
      activeDocument?.subject,
      postReply,
      methods,
      formatMessage,
    ],
  )

  const isLoading = loading || postReplyLoading
  const isSubmitDisabled = methods.formState.isSubmitting || postReplyLoading

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        padding={5}
        alignItems="center"
      >
        <LoadingDots />
      </Box>
    )
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(handleSubmitForm)}
        className={styles.form}
      >
        <Controller
          name="reply"
          control={methods.control}
          rules={{
            validate: validateReply,
          }}
          render={({
            field: { value = '', onChange },
            fieldState: { error },
          }) => (
            <Box className={styles.controllerBox}>
              <Input
                loading={postReplyLoading}
                disabled={postReplyLoading}
                autoFocus
                textarea
                rows={6}
                name="reply-message"
                label={formatMessage(messages.message)}
                backgroundColor="blue"
                placeholder={formatMessage(messages.messagesHere)}
                maxLength={MAX_REPLY_LENGTH}
                onChange={(e) => onChange(e.target.value)}
                value={value}
                errorMessage={error?.message}
              />

              <Box display="flex" justifyContent="flexEnd" marginTop={3}>
                <Button
                  type="submit"
                  size="small"
                  disabled={isSubmitDisabled || postReplyLoading}
                  fluid={isMobile}
                >
                  {formatMessage(messages.sendMessage)}
                </Button>
              </Box>
            </Box>
          )}
        />
      </form>
    </FormProvider>
  )
}

export default ReplyForm
