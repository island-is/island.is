import { Box, Button, Input, toast } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useIsMobile } from '@island.is/portals/my-pages/core'
import { useUserProfile } from '@island.is/portals/my-pages/graphql'
import { useUserInfo } from '@island.is/react-spa/bff'
import React from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { useReplyMutation } from '../../queries/Reply.generated'
import { useDocumentContext } from '../../screens/Overview/DocumentContext'
import { messages } from '../../utils/messages'

interface Props {
  hasEmail: boolean
  successfulSubmit: () => void
}

interface FormData {
  reply: string
}

const ReplyForm: React.FC<Props> = ({ successfulSubmit }) => {
  const methods = useForm<FormData>()
  const { activeDocument, setReplyState } = useDocumentContext()
  const { data: userProfile } = useUserProfile()
  const { profile } = useUserInfo()
  const { formatMessage } = useLocale()
  const { isMobile } = useIsMobile()

  const [postReply, { loading: postReplyLoading }] = useReplyMutation({
    onError: () => {
      toast.error(formatMessage(messages.replySentError))
    },
    onCompleted: (response) => {
      if (!response.documentsV2Reply) {
        toast.error(formatMessage(messages.replySentError))
        return
      }
      toast.success(formatMessage(messages.replySentShort))
      successfulSubmit()
      setReplyState((prev) => ({
        ...prev,
        reply: {
          id: response.documentsV2Reply?.id ?? undefined,
          email: response.documentsV2Reply?.email ?? '',
          body: methods.getValues('reply') ?? '',
        },
      }))
    },
  })

  const handleSubmitForm = (data: FormData) => {
    if (data.reply === '') {
      methods.setError('reply', {
        message: formatMessage(messages.replyCannotBeEmpty),
      })
    } else if (activeDocument?.id === undefined) {
      toast.error(formatMessage(messages.replySentError))
    } else {
      postReply({
        variables: {
          input: {
            documentId: activeDocument.id,
            body: data.reply,
            requesterEmail: profile.email ?? userProfile?.email ?? '',
            subject: activeDocument?.subject,
            requesterName: profile.name,
          },
        },
      })
    }
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmitForm)}>
        <Controller
          name="reply"
          control={methods.control}
          render={({ field: { value, onChange } }) => (
            <Box>
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
                maxLength={500}
                onChange={(e) => onChange(e.target.value)}
                value={value}
                errorMessage={methods.formState.errors.reply?.message}
              />

              <Box display="flex" justifyContent="flexEnd" marginTop={3}>
                <Button
                  type="submit"
                  size="small"
                  disabled={methods.formState.isSubmitting || postReplyLoading}
                  fluid={isMobile ? true : false}
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
