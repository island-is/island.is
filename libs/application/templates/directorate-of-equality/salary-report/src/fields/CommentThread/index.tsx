import { Fragment, useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import {
  UPDATE_APPLICATION,
  UPDATE_APPLICATION_EXTERNAL_DATA,
} from '@island.is/application/graphql'
import { getValueViaPath } from '@island.is/application/core'
import { CustomField, FieldBaseProps } from '@island.is/application/types'
import {
  Box,
  Button,
  Divider,
  Icon,
  LoadingDots,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { InputController } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { useFormContext } from 'react-hook-form'
import type { ApplicationReportCommentDto } from '@island.is/clients/directorate-of-equality'
import { ApiActions, draftActionId, States } from '../../utils/constants'
import { messages } from '../../lib/messages'

const SENDABLE_STATES: string[] = [States.POSTPONED, States.DRAFT_RETRY]

// Long threads collapse to the first and last few entries with a "see all"
// escape hatch in between — same shape as DMR's own timeline feed.
const HEAD_COUNT = 3
const TAIL_COUNT = 3
const COLLAPSE_THRESHOLD = HEAD_COUNT + TAIL_COUNT

const CommentAvatar = ({ incoming }: { incoming: boolean }) => (
  <Box
    display="flex"
    alignItems="center"
    justifyContent="center"
    style={{
      width: 40,
      height: 40,
      borderRadius: '50%',
      flexShrink: 0,
      backgroundColor: theme.color.blue400,
    }}
  >
    <Icon icon={incoming ? 'arrowBack' : 'arrowForward'} color="white" />
  </Box>
)

export const CommentThread = ({ application, field }: FieldBaseProps) => {
  const showEmptyState =
    (field as CustomField)?.props?.['showEmptyState'] === true
  // Set where the screen already carries "Athugasemdir" as its own title, so
  // the heading below is not rendered twice.
  const hideTitle = (field as CustomField)?.props?.['hideTitle'] === true
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
  const [isReplying, setIsReplying] = useState(false)
  const [showAll, setShowAll] = useState(false)

  const [updateApplication] = useMutation(UPDATE_APPLICATION)
  const [updateApplicationExternalData] = useMutation(
    UPDATE_APPLICATION_EXTERNAL_DATA,
  )

  // Comments are only available once DMR/the reviewer has opened the thread by
  // leaving the first one — the applicant can never write the first comment,
  // regardless of application state.
  const hasReviewerComment = comments.some(
    (comment) => comment.authorKind === 'REVIEWER',
  )
  const canSend =
    SENDABLE_STATES.includes(application.state) && hasReviewerComment

  useEffect(() => {
    updateApplicationExternalData({
      variables: {
        input: {
          id: application.id,
          dataProviders: [
            {
              actionId: draftActionId(ApiActions.getReportComments),
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
      .catch(() => toast.error(formatMessage(messages.comments.loadError)))
      .finally(() => setIsLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const formatRelativeDate = (value: Date | string) => {
    const date = new Date(value)
    const diffDays = Math.floor(
      (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24),
    )
    if (diffDays <= 0) return formatMessage(messages.comments.today)
    if (diffDays === 1) return formatMessage(messages.comments.yesterday)
    if (diffDays < 7)
      return formatMessage(messages.comments.daysAgo, { days: diffDays })
    return date.toLocaleDateString(locale)
  }

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
            answers: { comment: { newMessage: draft } },
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
                actionId: draftActionId(ApiActions.submitReportComment),
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
        setIsReplying(false)
        await updateApplication({
          variables: {
            input: {
              id: application.id,
              answers: { comment: { newMessage: '' } },
            },
            locale,
          },
        })
      } else {
        toast.error(formatMessage(messages.comments.sendError))
      }
    } catch {
      toast.error(formatMessage(messages.comments.sendError))
    } finally {
      setIsSending(false)
    }
  }

  const cancelReply = () => {
    setValue('comment.newMessage', '')
    setIsReplying(false)
  }

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" paddingY={5}>
        <LoadingDots />
      </Box>
    )
  }

  if (!hasReviewerComment && !showEmptyState) return null

  const renderEntry = (comment: ApplicationReportCommentDto) => {
    const isReviewer = comment.authorKind === 'REVIEWER'
    return (
      <Box
        display="flex"
        flexDirection="row"
        alignItems="flexStart"
        columnGap={2}
        paddingY={3}
        paddingX={2}
      >
        <CommentAvatar incoming={isReviewer} />
        <Box style={{ flex: 1, minWidth: 0 }}>
          <Box
            display="flex"
            justifyContent="spaceBetween"
            alignItems="flexStart"
            rowGap={1}
            columnGap={1}
            flexDirection={['columnReverse', 'columnReverse', 'row']}
          >
            <Text>
              <strong style={{ fontWeight: 600 }}>
                {isReviewer
                  ? formatMessage(messages.comments.reviewerLabel)
                  : formatMessage(messages.comments.companyLabel)}
              </strong>{' '}
              {formatMessage(messages.comments.registersComment)}
            </Text>
            <Box>
              <Text>{formatRelativeDate(comment.createdAt)}</Text>
            </Box>
          </Box>
          <Box paddingRight={[0, 0, 6]}>
            <Text marginTop={1}>{comment.body}</Text>
          </Box>
        </Box>
      </Box>
    )
  }

  const renderList = (items: ApplicationReportCommentDto[]) =>
    items.map((comment, index) => (
      <Fragment key={comment.id}>
        {index > 0 && <Divider />}
        {renderEntry(comment)}
      </Fragment>
    ))

  const shouldCollapse = !showAll && comments.length > COLLAPSE_THRESHOLD
  const hiddenCount = shouldCollapse
    ? comments.length - HEAD_COUNT - TAIL_COUNT
    : 0

  return (
    // 24px below: buildMultiField defaults `space` to 0, so an inline thread
    // would otherwise butt straight up against the field under it.
    <Box
      display="flex"
      flexDirection="column"
      background="blue100"
      borderRadius="large"
      padding={4}
      marginBottom={3}
    >
      {!hideTitle && (
        <Text variant="h4" marginBottom={1}>
          {formatMessage(messages.comments.title)}
        </Text>
      )}
      <Box aria-live="polite">
        {comments.length === 0 ? (
          <Box paddingY={2}>
            <Text color="dark400">
              {formatMessage(messages.comments.emptyState)}
            </Text>
          </Box>
        ) : shouldCollapse ? (
          <>
            {renderList(comments.slice(0, HEAD_COUNT))}
            <Divider />
            <Box paddingY={3} marginLeft={7}>
              <Button
                variant="text"
                size="small"
                onClick={() => setShowAll(true)}
              >
                {formatMessage(messages.comments.seeAllComments)} ({hiddenCount}
                )
              </Button>
            </Box>
            <Divider />
            {renderList(comments.slice(-TAIL_COUNT))}
          </>
        ) : (
          renderList(comments)
        )}
      </Box>

      {canSend && (
        <Box marginTop={3}>
          {isReplying ? (
            <Box display="flex" flexDirection="column" rowGap={2}>
              <InputController
                id="comment.newMessage"
                name="comment.newMessage"
                label={formatMessage(messages.comments.textareaLabel)}
                placeholder={formatMessage(messages.comments.placeholder)}
                backgroundColor="white"
                textarea
                rows={5}
                autoFocus
              />
              <Box
                display="flex"
                justifyContent="flexEnd"
                alignItems="center"
                columnGap={2}
              >
                <Button
                  variant="ghost"
                  size="small"
                  onClick={cancelReply}
                  disabled={isSending}
                >
                  {formatMessage(messages.comments.cancelButton)}
                </Button>
                <Button size="small" onClick={handleSend} loading={isSending}>
                  {formatMessage(messages.comments.sendButton)}
                </Button>
              </Box>
            </Box>
          ) : (
            <Box display="flex" justifyContent="flexEnd">
              <Button
                variant="ghost"
                size="small"
                icon="pencil"
                iconType="outline"
                onClick={() => setIsReplying(true)}
              >
                {formatMessage(messages.comments.replyButton)}
              </Button>
            </Box>
          )}
        </Box>
      )}
    </Box>
  )
}

export default CommentThread
