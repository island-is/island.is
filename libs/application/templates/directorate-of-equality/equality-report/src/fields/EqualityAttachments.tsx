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
  Stack,
  Text,
  UploadFile,
} from '@island.is/island-ui/core'
import { messages } from '../lib/messages'
import { useEnsureEqualityDraft } from '../utils/useEqualityDraft'
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
 */
export const EqualityAttachments = ({
  application,
  field,
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
  const mountedRef = useRef(true)

  const busy = !!uploading || !!removingId

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  // Same cleanup as the Editor: Screen keeps this flag across screens, so it
  // must be released when the field unmounts mid-upload.
  useEffect(() => {
    setSubmitButtonDisabled?.(busy)
    return () => setSubmitButtonDisabled?.(false)
  }, [busy, setSubmitButtonDisabled])

  const reload = useCallback(async (): Promise<Attachment[] | undefined> => {
    try {
      const { data } = await client.query<{
        directorateOfEqualityEqualityAttachments: Attachment[]
      }>({
        query: EQUALITY_ATTACHMENTS,
        variables: { input: { applicationId: application.id } },
        fetchPolicy: 'network-only',
      })
      const list = data.directorateOfEqualityEqualityAttachments
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
    if (busy || files.length === 0) return
    const nextErrors: string[] = []
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
    setErrors(
      rejections.map(({ file }) =>
        formatMessage(m.unsupportedType, { filename: file.name }),
      ),
    )
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
