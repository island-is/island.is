import { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import {
  UPDATE_APPLICATION,
  UPDATE_APPLICATION_EXTERNAL_DATA,
} from '@island.is/application/graphql'
import { getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import {
  Box,
  Button,
  LoadingDots,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { InputController } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { useFormContext } from 'react-hook-form'
import type { ApplicationReportCommentDto } from '@island.is/clients/directorate-of-equality'
import { ApiActions, States } from '../../utils/constants'
import { messages } from '../../lib/messages'

const SENDABLE_STATES: string[] = [States.IN_REVIEW, States.POSTPONED]

export const CommentThread = ({ application }: FieldBaseProps) => {
  const { formatMessage, lang: locale } = useLocale()
  const { getValues, setValue } = useFormContext()
  const [comments, setComments] = useState<ApplicationReportCommentDto[]>(
    () =>
      getValueViaPath<ApplicationReportCommentDto[]>(
        application.externalData,
        'getReportComments.data',
      ) ?? [],
  )
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)

  const [updateApplication] = useMutation(UPDATE_APPLICATION)
  const [updateApplicationExternalData] = useMutation(
    UPDATE_APPLICATION_EXTERNAL_DATA,
  )

  const canSend = SENDABLE_STATES.includes(application.state)

  useEffect(() => {
    updateApplicationExternalData({
      variables: {
        input: {
          id: application.id,
          dataProviders: [
            {
              actionId: `DirectorateOfEquality.${ApiActions.getReportComments}`,
              order: 0,
            },
          ],
        },
        locale,
      },
    })
      .then((res) => {
        const fetched = res.data?.updateApplicationExternalData.externalData
          ?.getReportComments?.data as ApplicationReportCommentDto[] | undefined
        if (fetched) setComments(fetched)
      })
      .finally(() => setIsLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSend = async () => {
    const draft = (
      getValues('comment.newMessage') as string | undefined
    )?.trim()
    if (!draft) return

    setIsSending(true)
    try {
      await updateApplication({
        variables: {
          input: {
            id: application.id,
            answers: {
              ...application.answers,
              comment: { newMessage: draft },
            },
          },
          locale,
        },
      })

      const res = await updateApplicationExternalData({
        variables: {
          input: {
            id: application.id,
            dataProviders: [
              {
                actionId: `DirectorateOfEquality.${ApiActions.submitReportComment}`,
                order: 0,
              },
            ],
          },
          locale,
        },
      })

      const newComment = res.data?.updateApplicationExternalData.externalData
        ?.submitReportComment?.data as ApplicationReportCommentDto | undefined

      if (newComment) {
        setComments((prev) => [...prev, newComment])
        setValue('comment.newMessage', '')
      } else {
        toast.error(formatMessage(messages.comments.sendError))
      }
    } catch {
      toast.error(formatMessage(messages.comments.sendError))
    } finally {
      setIsSending(false)
    }
  }

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" paddingY={5}>
        <LoadingDots />
      </Box>
    )
  }

  if (comments.length === 0 && !canSend) return null

  return (
    <Box>
      <Text variant="h4" marginBottom={3}>
        {formatMessage(messages.comments.title)}
      </Text>

      {comments.length === 0 ? (
        <Text color="dark400" marginBottom={3}>
          {formatMessage(messages.comments.emptyState)}
        </Text>
      ) : (
        <Box marginBottom={3} aria-live="polite">
          {comments.map((comment) => (
            <Box
              key={comment.id}
              background={
                comment.authorKind === 'REVIEWER' ? 'blue100' : 'white'
              }
              border="standard"
              borderRadius="large"
              padding={3}
              marginBottom={2}
            >
              <Text variant="eyebrow" marginBottom={1}>
                {comment.authorKind === 'REVIEWER'
                  ? formatMessage(messages.comments.reviewerLabel)
                  : formatMessage(messages.comments.companyLabel)}
                {' · '}
                {new Date(comment.createdAt).toLocaleString(locale)}
              </Text>
              <Text>{comment.body}</Text>
            </Box>
          ))}
        </Box>
      )}

      {canSend && (
        <Box>
          <Box marginBottom={2}>
            <InputController
              id="comment.newMessage"
              name="comment.newMessage"
              label={formatMessage(messages.comments.textareaLabel)}
              textarea
              rows={3}
            />
          </Box>
          <Button onClick={handleSend} loading={isSending}>
            {formatMessage(messages.comments.sendButton)}
          </Button>
        </Box>
      )}
    </Box>
  )
}

export default CommentThread
