import { useCallback, useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { gql, useApolloClient } from '@apollo/client'
import { FileRejection } from 'react-dropzone'
import { CustomField, FieldBaseProps } from '@island.is/application/types'
import {
  AlertMessage,
  Box,
  Bullet,
  BulletList,
  FileUploadStatus,
  InputFileUpload,
  LoadingDots,
  SkeletonLoader,
  Stack,
  Text,
  UploadFile,
} from '@island.is/island-ui/core'
import { ReviewGroup } from '@island.is/application/ui-components'
import { messages } from '../lib/messages'
import { useEnsureEqualityDraft } from '../utils/useEqualityDraft'
import { useScreenEntered } from '../utils/useScreenEntered'
import {
  ATTACHMENT_ACCEPT,
  ATTACHMENT_CONTENT_TYPES,
  MAX_ATTACHMENTS,
  getAttachmentExtension,
  getAttachmentRejection,
  validateAttachment,
} from '../utils/equalityAttachments'

const EQUALITY_ATTACHMENTS = gql`
  query DirectorateOfEqualityEqualityAttachments(
    $input: DirectorateOfEqualityEqualityAttachmentsInput!
  ) {
    directorateOfEqualityEqualityAttachments(input: $input) {
      id
      filename
      sizeBytes
    }
  }
`

const PRESIGN_EQUALITY_ATTACHMENT = gql`
  mutation DirectorateOfEqualityPresignEqualityAttachment(
    $input: DirectorateOfEqualityPresignEqualityAttachmentInput!
  ) {
    directorateOfEqualityPresignEqualityAttachment(input: $input) {
      url
      key
    }
  }
`

const ADD_EQUALITY_ATTACHMENT = gql`
  mutation DirectorateOfEqualityAddEqualityAttachment(
    $input: DirectorateOfEqualityAddEqualityAttachmentInput!
  ) {
    directorateOfEqualityAddEqualityAttachment(input: $input) {
      id
    }
  }
`

const DELETE_EQUALITY_ATTACHMENT = gql`
  mutation DirectorateOfEqualityDeleteEqualityAttachment(
    $input: DirectorateOfEqualityDeleteEqualityAttachmentInput!
  ) {
    directorateOfEqualityDeleteEqualityAttachment(input: $input)
  }
`

type Attachment = { id: string; filename: string; sizeBytes: number }

// Cap the presigned PUT so a stalled upload can't leave the field busy.
const UPLOAD_TIMEOUT_MS = 60_000

// The multi-field holding the plan and the fylgiskjöl (equalityReportSection).
const GOALS_AND_ACTIONS_SCREEN = 'goalsAndActionsMultiField'

const ATTACHMENTS_BEFORE_SUBMIT = {
  allowMultiple: true,
  customCallbackId: 'equalityReportAttachments',
}

interface Props extends FieldBaseProps {
  field: CustomField
}

/**
 * Fylgiskjöl: extra files sent with the plan, which only Jafnréttisstofa sees.
 *
 * Nothing here is stored in answers. DMR holds the files and the list is read
 * back from it after every change. Each file goes presign → PUT to S3 →
 * register, one at a time; the bytes never pass through GraphQL.
 *
 * `mode: 'draft'` (mainForm) makes sure the DMR draft exists first, as the
 * Editor does. `mode: 'retry'` (draftRetryForm) works on the submitted report,
 * where DMR counts every change as the company's reply to the reviewer.
 * `mode: 'overview'` only lists the files, for the overview screen; answers
 * hold nothing for a buildOverviewField to show.
 */
export const EqualityAttachments = (props: Props) =>
  props.field?.props?.['mode'] === 'overview' ? (
    <EqualityAttachmentsOverview {...props} />
  ) : (
    <EditableEqualityAttachments {...props} />
  )

// Laid out like a buildOverviewField block, with its edit link back to the
// plan screen, so it sits in the overview with the other sections.
const EqualityAttachmentsOverview = ({ application, goToScreen }: Props) => {
  const { formatMessage } = useIntl()
  const client = useApolloClient()
  const m = messages.equalityReport.attachments
  const [attachments, setAttachments] = useState<Attachment[] | undefined>()
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    let active = true
    client
      .query<{
        directorateOfEqualityEqualityAttachments: Attachment[] | null
      }>({
        query: EQUALITY_ATTACHMENTS,
        variables: { input: { applicationId: application.id } },
        fetchPolicy: 'network-only',
      })
      .then(({ data }) => {
        if (active) {
          setAttachments(data.directorateOfEqualityEqualityAttachments ?? [])
        }
      })
      .catch(() => {
        if (active) setLoadError(true)
      })
    return () => {
      active = false
    }
  }, [client, application.id])

  return (
    <ReviewGroup
      isLast
      editAction={() => goToScreen?.(GOALS_AND_ACTIONS_SCREEN)}
    >
      <Box marginRight={12}>
        <Text variant="h3" as="h3" paddingTop={2} paddingBottom={5}>
          {formatMessage(m.title)}
        </Text>
      </Box>
      {loadError ? (
        <Text variant="eyebrow" color="red600">
          {formatMessage(m.loadError)}
        </Text>
      ) : !attachments ? (
        <SkeletonLoader height={40} width="80%" borderRadius="large" />
      ) : attachments.length === 0 ? (
        <Text>{formatMessage(m.none)}</Text>
      ) : (
        <Stack space={1}>
          {attachments.map((attachment) => (
            <Text key={attachment.id}>{attachment.filename}</Text>
          ))}
        </Stack>
      )}
    </ReviewGroup>
  )
}

const EditableEqualityAttachments = ({
  application,
  field,
  setBeforeSubmitCallback,
  setSubmitButtonDisabled,
}: Props) => {
  const { formatMessage } = useIntl()
  const client = useApolloClient()
  const ensureDraft = useEnsureEqualityDraft(application)
  const m = messages.equalityReport.attachments

  const mode = field?.props?.['mode'] === 'retry' ? 'retry' : 'draft'

  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [uploading, setUploading] = useState<string | undefined>()
  const [removingId, setRemovingId] = useState<string | undefined>()
  const [errors, setErrors] = useState<string[]>([])
  const [blockMessage, setBlockMessage] = useState<string | undefined>()
  const mountedRef = useRef(true)
  // Dropzone reports rejected files and then accepted ones in the same drop,
  // through two callbacks. Held here so the second doesn't erase the first.
  const dropRejectionsRef = useRef<string[]>([])

  const busy = !!uploading || !!removingId

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  // Same cleanup as the Editor: Screen keeps this flag across screens, so it
  // must be released when the field unmounts mid-upload. The Editor writes the
  // same single flag, so either field can clear the other's disabled state;
  // the before-submit guards below and in the Editor are what actually hold.
  useEffect(() => {
    setSubmitButtonDisabled?.(busy)
    if (!busy) setBlockMessage(undefined)
    return () => setSubmitButtonDisabled?.(false)
  }, [busy, setSubmitButtonDisabled])

  // Leaving the screen (or sending the reply on draftRetryForm) mid-upload
  // would drop a file the applicant thinks is on its way. Composed with the
  // Editor's guard rather than replacing it.
  //
  // Registered again after Screen's arrival clear (see useScreenEntered), and
  // again whenever `busy` changes so the guard reads the current value.
  const screenEntered = useScreenEntered()
  useEffect(() => {
    if (!setBeforeSubmitCallback) return
    setBeforeSubmitCallback(async () => {
      if (busy) {
        const message = formatMessage(m.uploadInProgress)
        setBlockMessage(message)
        return [false, message]
      }
      return [true, null]
    }, ATTACHMENTS_BEFORE_SUBMIT)
  }, [screenEntered, busy, setBeforeSubmitCallback, formatMessage, m])

  const reload = useCallback(async (): Promise<Attachment[] | undefined> => {
    try {
      const { data } = await client.query<{
        directorateOfEqualityEqualityAttachments: Attachment[] | null
      }>({
        query: EQUALITY_ATTACHMENTS,
        variables: { input: { applicationId: application.id } },
        fetchPolicy: 'network-only',
      })
      // Nullable root query (domain convention); a failure arrives as an
      // error, so null only ever means nothing to show.
      const list = data.directorateOfEqualityEqualityAttachments ?? []
      if (mountedRef.current) {
        setAttachments(list)
        setLoadError(false)
      }
      return list
    } catch {
      if (mountedRef.current) setLoadError(true)
      return undefined
    }
  }, [client, application.id])

  useEffect(() => {
    const load = async () => {
      try {
        if (mode === 'draft') await ensureDraft()
        await reload()
      } catch {
        if (mountedRef.current) setLoadError(true)
      } finally {
        if (mountedRef.current) setLoading(false)
      }
    }
    void load()
  }, [mode, ensureDraft, reload])

  const uploadOne = async (file: File): Promise<string | undefined> => {
    const extension = getAttachmentExtension(file.name)
    if (!extension) {
      return formatMessage(m.unsupportedType, { filename: file.name })
    }
    try {
      const { data: presignData } = await client.mutate<{
        directorateOfEqualityPresignEqualityAttachment: {
          url: string
          key: string
        }
      }>({
        mutation: PRESIGN_EQUALITY_ATTACHMENT,
        variables: { input: { applicationId: application.id, extension } },
      })
      const presign =
        presignData?.directorateOfEqualityPresignEqualityAttachment
      if (!presign?.url) {
        return formatMessage(m.uploadError, { filename: file.name })
      }

      // No auth header: the presigned URL is the capability.
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), UPLOAD_TIMEOUT_MS)
      let response: Response
      try {
        response = await fetch(presign.url, {
          method: 'PUT',
          body: file,
          headers: { 'Content-Type': ATTACHMENT_CONTENT_TYPES[extension] },
          signal: controller.signal,
        })
      } finally {
        clearTimeout(timeout)
      }
      if (!response.ok) {
        return formatMessage(m.uploadError, { filename: file.name })
      }

      await client.mutate({
        mutation: ADD_EQUALITY_ATTACHMENT,
        variables: {
          input: {
            applicationId: application.id,
            key: presign.key,
            filename: file.name,
          },
        },
      })
      return undefined
    } catch (error) {
      const { rejected, reason } = getAttachmentRejection(error)
      if (reason) {
        return formatMessage(m.rejectedWithReason, {
          filename: file.name,
          reason,
        })
      }
      return rejected
        ? formatMessage(m.rejected, { filename: file.name })
        : formatMessage(m.uploadError, { filename: file.name })
    }
  }

  const handleFilesChanged = async (files: File[]) => {
    const nextErrors = [...dropRejectionsRef.current]
    dropRejectionsRef.current = []
    if (busy || files.length === 0) return
    const accepted: File[] = []

    for (const file of files) {
      const rejection = validateAttachment(file)
      if (rejection) {
        nextErrors.push(formatMessage(m[rejection], { filename: file.name }))
      } else {
        accepted.push(file)
      }
    }

    // Presign refuses once the report holds six, so don't start what can't
    // finish. The list may be stale; DMR has the last word either way.
    const room = Math.max(0, MAX_ATTACHMENTS - attachments.length)
    const toUpload = accepted.slice(0, room)
    const skipped = accepted.length - toUpload.length
    if (skipped > 0) {
      nextErrors.push(formatMessage(m.overLimit, { count: skipped }))
    }
    setErrors(nextErrors)

    for (const file of toUpload) {
      setUploading(file.name)
      const error = await uploadOne(file)
      if (!mountedRef.current) return
      if (error) {
        nextErrors.push(error)
        setErrors([...nextErrors])
      }
      await reload()
    }
    if (mountedRef.current) setUploading(undefined)
  }

  const handleRemove = async (file: UploadFile) => {
    if (busy || !file.id) return
    setErrors([])
    setRemovingId(file.id)
    try {
      await client.mutate({
        mutation: DELETE_EQUALITY_ATTACHMENT,
        variables: {
          input: { applicationId: application.id, attachmentId: file.id },
        },
      })
    } catch (error) {
      const { reason } = getAttachmentRejection(error)
      setErrors([
        reason
          ? formatMessage(m.rejectedWithReason, {
              filename: file.name,
              reason,
            })
          : formatMessage(m.removeError, { filename: file.name }),
      ])
    }
    await reload()
    if (mountedRef.current) setRemovingId(undefined)
  }

  const handleUploadRejection = (rejections: FileRejection[]) => {
    const rejectionMessages = rejections.map(({ file }) =>
      formatMessage(m.unsupportedType, { filename: file.name }),
    )
    setErrors(rejectionMessages)
    // onChange, if this drop also had accepted files, runs synchronously right
    // after this and picks these up. Cleared after the drop either way, so a
    // rejection-only drop can't leak into the next one.
    dropRejectionsRef.current = rejectionMessages
    queueMicrotask(() => {
      dropRejectionsRef.current = []
    })
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" paddingY={3}>
        <LoadingDots />
      </Box>
    )
  }

  const files: UploadFile[] = [
    ...attachments.map((attachment) => ({
      id: attachment.id,
      name: attachment.filename,
      size: attachment.sizeBytes,
      status:
        attachment.id === removingId
          ? FileUploadStatus.uploading
          : FileUploadStatus.done,
    })),
    ...(uploading
      ? [{ name: uploading, status: FileUploadStatus.uploading }]
      : []),
  ]
  const full = attachments.length >= MAX_ATTACHMENTS

  return (
    <Stack space={2}>
      <Text variant="h4" as="h3">
        {formatMessage(m.title)}
      </Text>
      {blockMessage && <AlertMessage type="warning" message={blockMessage} />}
      {loadError && (
        <AlertMessage
          type="warning"
          title={formatMessage(messages.errors.alertTitle)}
          message={formatMessage(m.loadError)}
        />
      )}
      {errors.length > 0 && (
        <AlertMessage
          type="error"
          title={formatMessage(messages.errors.alertTitle)}
          message={
            errors.length > 1 ? (
              <BulletList>
                {errors.map((message, index) => (
                  <Bullet key={index}>{message}</Bullet>
                ))}
              </BulletList>
            ) : (
              errors[0]
            )
          }
        />
      )}
      <InputFileUpload
        name="equalityAttachmentsUpload"
        files={files}
        description={formatMessage(m.description)}
        buttonLabel={formatMessage(m.uploadButton)}
        accept={ATTACHMENT_ACCEPT}
        multiple
        disabled={busy || full}
        onChange={(newFiles) => void handleFilesChanged(newFiles)}
        onRemove={(file) => void handleRemove(file)}
        onUploadRejection={handleUploadRejection}
      />
      {full && <Text variant="small">{formatMessage(m.limitReached)}</Text>}
    </Stack>
  )
}

export default EqualityAttachments
