import { useFormContext } from 'react-hook-form'
import { getErrorViaPath, getValueViaPath } from '@island.is/application/core'
import { CustomField, FieldBaseProps } from '@island.is/application/types'
import {
  AlertMessage,
  Box,
  Button,
  FileUploadStatus,
  InputFileUpload,
  UploadFile,
} from '@island.is/island-ui/core'
import { messages } from '../lib/messages'
import { useIntl } from 'react-intl'
import { useRef, useState } from 'react'
import mammoth from 'mammoth'
import { FileRejection } from 'react-dropzone'
import { useMutation } from '@apollo/client'
import { UPDATE_APPLICATION_EXTERNAL_DATA } from '@island.is/application/graphql'
import { useLocale } from '@island.is/localization'
import { ApiActions } from '../utils/constants'
import { escapeHtml } from '../utils/htmlHelpers'
import {
  useEnsureEqualityDraft,
  useEqualityContentPush,
} from '../utils/useEqualityDraft'

interface Props extends FieldBaseProps {
  field: CustomField
}

export const Editor = ({ application, errors, field }: Props) => {
  const { formatMessage } = useIntl()
  const { locale } = useLocale()
  const { setValue } = useFormContext()
  const m = messages.equalityReport.information

  const mode =
    field?.props && typeof field.props['mode'] === 'string'
      ? (field.props['mode'] as 'draft' | 'retry')
      : 'draft'

  const ensureDraft = useEnsureEqualityDraft(application)
  const { pushDraftContent, pushRetryContent } = useEqualityContentPush()

  const initialFilename = getValueViaPath<string>(
    application.answers,
    'goalsAndActions.filename',
  )

  // No content lives in application.answers anymore, so the only signal a
  // resumed screen has is `filename` — a synthetic entry (status: done) is
  // enough for InputFileUpload to render the already-uploaded state.
  const [selectedFile, setSelectedFile] = useState<UploadFile | null>(() =>
    initialFilename
      ? { name: initialFilename, status: FileUploadStatus.done }
      : null,
  )
  const [uploadSuccess, setUploadSuccess] = useState(!!initialFilename)
  // Conversion/read failures and the download-template failure — distinct
  // from `rejectionMessage` below, which feeds InputFileUpload's own
  // `errorMessage` slot instead of a standalone alert.
  const [actionError, setActionError] = useState<string | undefined>()
  const [rejectionMessage, setRejectionMessage] = useState<string | undefined>()
  const [loadingDocx, setLoadingDocx] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  // The filename last known to actually match DMR's stored content — restored
  // on a failed replacement so a bad re-upload attempt can't strand the user
  // on an invalid, unrecoverable field.
  const lastGoodFilenameRef = useRef(initialFilename ?? '')

  const [updateApplicationExternalData] = useMutation(
    UPDATE_APPLICATION_EXTERNAL_DATA,
  )

  const handleFile = async (file: File) => {
    setActionError(undefined)
    setRejectionMessage(undefined)
    setUploadSuccess(false)
    setIsUploading(true)
    // Clear the (possibly still-valid, previously pushed) filename for the
    // duration of this attempt so the required-field check fails and
    // Continue is blocked — otherwise a replacement upload could still be
    // in flight to DMR while the stale-but-valid old filename lets the user
    // navigate straight to Submit.
    setValue('goalsAndActions.filename', '', { shouldValidate: true })
    setSelectedFile({ name: file.name, status: FileUploadStatus.uploading })

    const restoreLastGood = () => {
      setValue('goalsAndActions.filename', lastGoodFilenameRef.current, {
        shouldValidate: true,
      })
      setSelectedFile(
        lastGoodFilenameRef.current
          ? { name: lastGoodFilenameRef.current, status: FileUploadStatus.done }
          : null,
      )
    }

    try {
      let html = ''

      if (file.name.endsWith('.docx')) {
        const arrayBuffer = await file.arrayBuffer()
        const result = await mammoth.convertToHtml({ arrayBuffer })
        html = result.value
      } else if (file.name.endsWith('.txt')) {
        const text = await file.text()
        html = text
          .split(/\n\n+/)
          .map((p) => `<p>${escapeHtml(p).replace(/\n/g, '<br />')}</p>`)
          .join('')
      } else {
        restoreLastGood()
        setRejectionMessage(formatMessage(m.editorUnsupportedFile))
        return
      }

      // A .docx/.txt that converts to blank/whitespace-only content is
      // treated the same as an unsupported file — there's nothing to send.
      const plainTextLength = html.replace(/<[^>]*>/g, '').trim().length
      if (plainTextLength === 0) {
        restoreLastGood()
        setRejectionMessage(formatMessage(m.editorUnsupportedFile))
        return
      }

      const base64 = Buffer.from(html).toString('base64')

      if (mode === 'draft') {
        await ensureDraft()
        await pushDraftContent(application.id, base64)
      } else {
        await pushRetryContent(application.id, base64)
      }

      lastGoodFilenameRef.current = file.name
      setValue('goalsAndActions.filename', file.name, { shouldValidate: true })
      setSelectedFile({ name: file.name, status: FileUploadStatus.done })
      setUploadSuccess(true)
    } catch {
      restoreLastGood()
      setActionError(formatMessage(m.editorUploadError))
    } finally {
      setIsUploading(false)
    }
  }

  const handleFilesChanged = (files: File[]) => {
    const file = files[0]
    if (!file) return
    void handleFile(file)
  }

  const handleUploadRejection = (rejections: FileRejection[]) => {
    setActionError(undefined)
    setUploadSuccess(false)
    setSelectedFile(
      lastGoodFilenameRef.current
        ? { name: lastGoodFilenameRef.current, status: FileUploadStatus.done }
        : null,
    )
    setRejectionMessage(
      rejections[0]?.errors[0]?.code === 'file-invalid-type'
        ? formatMessage(m.editorUnsupportedFile)
        : formatMessage(m.editorUploadError),
    )
  }

  const handleRemove = () => {
    lastGoodFilenameRef.current = ''
    setValue('goalsAndActions.filename', '', { shouldValidate: true })
    setSelectedFile(null)
    setUploadSuccess(false)
    setActionError(undefined)
    setRejectionMessage(undefined)
  }

  const handleDownloadTemplateDocx = async () => {
    setLoadingDocx(true)
    setActionError(undefined)
    try {
      const res = await updateApplicationExternalData({
        variables: {
          input: {
            id: application.id,
            dataProviders: [
              {
                actionId: `DirectorateOfEquality.${ApiActions.getEqualityReportTemplateDocx}`,
                order: 0,
              },
            ],
          },
          locale,
        },
      })

      const base64 =
        res.data?.updateApplicationExternalData?.externalData
          ?.equalityReportTemplateDocx?.data?.base64

      if (typeof base64 === 'string') {
        const binary = atob(base64)
        const bytes = new Uint8Array(binary.length)
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i)
        }
        const blob = new Blob([bytes], {
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'jafnrettisaaetlun-snidmat.docx'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        setTimeout(() => URL.revokeObjectURL(url), 100)
      } else {
        setActionError(formatMessage(m.editorUploadError))
      }
    } catch {
      setActionError(formatMessage(m.editorUploadError))
    } finally {
      setLoadingDocx(false)
    }
  }

  const fieldError =
    errors && getErrorViaPath(errors, 'goalsAndActions.filename')

  return (
    <Box>
      <Box display="flex" justifyContent="flexEnd" marginBottom={3}>
        <Button
          variant="utility"
          size="small"
          icon="download"
          iconType="outline"
          loading={loadingDocx}
          disabled={loadingDocx}
          onClick={() => void handleDownloadTemplateDocx()}
        >
          {formatMessage(m.editorFetchTemplateDoc)}
        </Button>
      </Box>

      {actionError && (
        <Box marginBottom={3}>
          <AlertMessage type="error" message={actionError} />
        </Box>
      )}

      <InputFileUpload
        name="equalityReportUpload"
        files={selectedFile ? [selectedFile] : []}
        disabled={isUploading}
        description={formatMessage(m.editorSupportedFileTypes)}
        buttonLabel={formatMessage(m.editorUploadFile)}
        accept={['.txt', '.docx']}
        multiple={false}
        onChange={handleFilesChanged}
        onRemove={handleRemove}
        onUploadRejection={handleUploadRejection}
        errorMessage={rejectionMessage ?? fieldError}
      />

      {uploadSuccess && (
        <Box marginTop={3}>
          <AlertMessage
            type="success"
            message={formatMessage(m.editorUploadSuccess)}
          />
        </Box>
      )}
    </Box>
  )
}

export default Editor
