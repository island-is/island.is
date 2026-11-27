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
import { useEffect, useRef, useState } from 'react'
import { FileRejection } from 'react-dropzone'
import { useMutation } from '@apollo/client'
import { UPDATE_APPLICATION_EXTERNAL_DATA } from '@island.is/application/graphql'
import { useLocale } from '@island.is/localization'
import { ApiActions, draftActionId } from '../utils/constants'
import { escapeHtml, htmlToPlainText } from '../utils/htmlHelpers'
import {
  MAX_INLINE_BASE64_LENGTH,
  MAX_PLAN_PDF_BYTES,
  convertDocxToHtml,
  isPlanRejection,
} from '../utils/planUpload'
import {
  EqualityContentPayload,
  useEnsureEqualityDraft,
  useEqualityContentPush,
} from '../utils/useEqualityDraft'
import { useScreenEntered } from '../utils/useScreenEntered'

interface Props extends FieldBaseProps {
  field: CustomField
}

const EDITOR_BEFORE_SUBMIT = {
  allowMultiple: true,
  customCallbackId: 'equalityReportEditor',
}

export const Editor = ({
  application,
  errors,
  field,
  setBeforeSubmitCallback,
  setSubmitButtonDisabled,
}: Props) => {
  const { formatMessage } = useIntl()
  const { locale } = useLocale()
  const { setValue } = useFormContext()
  const m = messages.equalityReport.information

  const mode =
    field?.props && typeof field.props['mode'] === 'string'
      ? (field.props['mode'] as 'draft' | 'retry')
      : 'draft'

  const ensureDraft = useEnsureEqualityDraft(application)
  const { uploadPlanPdf, pushDraftContent, pushRetryContent } =
    useEqualityContentPush()

  const initialFilename = getValueViaPath<string>(
    application.answers,
    'goalsAndActions.filename',
  )

  // Content lives in DMR, not answers, so `filename` is a resumed screen's only
  // signal — a synthetic done entry is enough to render the uploaded state.
  const [selectedFile, setSelectedFile] = useState<UploadFile | null>(() =>
    initialFilename
      ? { name: initialFilename, status: FileUploadStatus.done }
      : null,
  )
  const [uploadSuccess, setUploadSuccess] = useState(!!initialFilename)
  // Standalone alert, unlike `rejectionMessage` below, which feeds
  // InputFileUpload's own `errorMessage` slot.
  const [actionError, setActionError] = useState<string | undefined>()
  const [rejectionMessage, setRejectionMessage] = useState<string | undefined>()
  const [loadingDocx, setLoadingDocx] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  // A failed REPLACEMENT restores the previous filename, which validates — so
  // zod alone would let the applicant submit the old plan believing the new one
  // landed. Mount-local, so navigating away and back is a way out.
  const [uploadFailed, setUploadFailed] = useState(false)
  // The shell files beforeSubmit errors under the SCREEN id, which no field
  // looks up — returning the message alone would refuse the press silently.
  const [blockMessage, setBlockMessage] = useState<string | undefined>()
  // Last filename known to match DMR's stored content. Both pushes replace
  // wholesale, so a failed one leaves DMR still holding exactly this file.
  const lastGoodFilenameRef = useRef(initialFilename ?? '')
  // The last upload was a .docx whose images were left out. Mount-local: it
  // explains the upload just made, not one from an earlier visit.
  const [imagesNotIncluded, setImagesNotIncluded] = useState(false)

  const [updateApplicationExternalData] = useMutation(
    UPDATE_APPLICATION_EXTERNAL_DATA,
  )

  // Drives both footer buttons: on draftRetryForm the submit button shares this
  // screen with the uploader, so continue and submit are one guard.
  const uploadUnresolved = isUploading || uploadFailed
  // `goalsAndActions` is optional in the schema and nothing registers
  // `filename`, so an untouched screen submits the key absent — and absent
  // passes zod. `selectedFile` covers untouched, in-flight and settled alike.
  const hasSettledFile = selectedFile?.status === FileUploadStatus.done

  // The shell keeps this flag in Screen, which does not remount between
  // screens and resets only setBeforeSubmitCallback — so without the cleanup a
  // failed upload followed by "Til baka" leaves Continue dead on the PREVIOUS
  // screen, with nothing mounted there to clear it.
  useEffect(() => {
    setSubmitButtonDisabled?.(uploadUnresolved)
    return () => setSubmitButtonDisabled?.(false)
  }, [uploadUnresolved, setSubmitButtonDisabled])

  const screenEntered = useScreenEntered()

  // Kept out of the disabled flag above: a button greyed out on arrival
  // explains nothing, so the untouched case blocks on press with a reason.
  // `screenEntered` re-registers it after Screen's arrival clear, which would
  // otherwise leave an untouched screen with no guard at all.
  useEffect(() => {
    if (!setBeforeSubmitCallback) return
    setBeforeSubmitCallback(async () => {
      if (uploadUnresolved) {
        // The failure alert is already on screen; no second copy.
        return [false, formatMessage(m.editorUploadIncomplete)]
      }
      if (!hasSettledFile) {
        const message = formatMessage(m.editorUploadRequired)
        setBlockMessage(message)
        return [false, message]
      }
      return [true, null]
      // Composed, not replacing: EqualityAttachments shares this screen and
      // registers its own guard, which a plain registration would wipe out.
    }, EDITOR_BEFORE_SUBMIT)
  }, [
    screenEntered,
    uploadUnresolved,
    hasSettledFile,
    setBeforeSubmitCallback,
    formatMessage,
    m,
  ])

  // retry keeps the previous file: it is a submitted plan that a failed
  // replacement leaves untouched. draft has submitted nothing, so a failure
  // clears the field — the applicant must end on an upload they saw succeed.
  const resetAfterFailure = () => {
    const fallback = mode === 'retry' ? lastGoodFilenameRef.current : ''
    setValue('goalsAndActions.filename', fallback, { shouldValidate: true })
    setSelectedFile(
      fallback ? { name: fallback, status: FileUploadStatus.done } : null,
    )
  }

  const handleFile = async (file: File) => {
    setActionError(undefined)
    setRejectionMessage(undefined)
    setUploadSuccess(false)
    setUploadFailed(false)
    setBlockMessage(undefined)
    setIsUploading(true)
    // Cleared for the duration of the attempt, so a replacement still in flight
    // to DMR cannot leave the old valid filename waving the applicant through.
    setValue('goalsAndActions.filename', '', { shouldValidate: true })
    setSelectedFile({ name: file.name, status: FileUploadStatus.uploading })
    setImagesNotIncluded(false)

    try {
      const name = file.name.toLowerCase()
      let payload: EqualityContentPayload
      let droppedImages = false

      if (name.endsWith('.pdf')) {
        /*
         * Uploaded as-is, with no conversion — that is the point of accepting
         * PDFs. The company's layout, tables and images survive, where mammoth
         * would have flattened them.
         *
         * The bytes go straight to S3 by presigned URL, like a fylgiskjal, and
         * only the key passes through GraphQL. DMR checks size and signature
         * again on registration; these checks just fail early with a reason.
         */
        if (file.size === 0) {
          resetAfterFailure()
          setUploadFailed(true)
          setRejectionMessage(formatMessage(m.editorPdfRejected))
          return
        }
        if (file.size > MAX_PLAN_PDF_BYTES) {
          resetAfterFailure()
          setUploadFailed(true)
          setRejectionMessage(formatMessage(m.editorFileTooLarge))
          return
        }

        // DMR presigns against an existing report, so the draft comes first.
        if (mode === 'draft') await ensureDraft()

        // A fresh key for every attempt: DMR consumes one on success and
        // refuses it after, so a key is never kept or reused.
        payload = {
          kind: 'pdfKey',
          key: await uploadPlanPdf(application.id, file),
          filename: file.name,
        }
      } else {
        let html = ''

        if (name.endsWith('.docx')) {
          const converted = await convertDocxToHtml(await file.arrayBuffer())
          html = converted.html
          droppedImages = converted.imageCount > 0
        } else if (name.endsWith('.txt')) {
          const text = await file.text()
          html = text
            .split(/\n\n+/)
            .map((p) => `<p>${escapeHtml(p).replace(/\n/g, '<br />')}</p>`)
            .join('')
        } else {
          resetAfterFailure()
          setUploadFailed(true)
          setRejectionMessage(formatMessage(m.editorUnsupportedFile))
          return
        }

        // Converts to nothing, so there is nothing to send: same as unsupported.
        // Deliberately not applied to the PDF branch — a scanned plan is all
        // images and has no extractable text, but it is still a real plan.
        // A .docx that is only images lands here too, and is better pointed
        // at PDF than told its format is unsupported.
        const plainTextLength = htmlToPlainText(html).length
        if (plainTextLength === 0) {
          resetAfterFailure()
          setUploadFailed(true)
          setRejectionMessage(
            formatMessage(
              droppedImages
                ? m.editorImagesNotIncluded
                : m.editorUnsupportedFile,
            ),
          )
          return
        }

        const base64 = Buffer.from(html).toString('base64')
        if (base64.length > MAX_INLINE_BASE64_LENGTH) {
          resetAfterFailure()
          setUploadFailed(true)
          setRejectionMessage(formatMessage(m.editorDocumentTooLarge))
          return
        }

        payload = { kind: 'html', base64 }
      }

      if (mode === 'draft') {
        await ensureDraft()
        await pushDraftContent(application.id, payload)
      } else {
        await pushRetryContent(application.id, payload)
      }

      lastGoodFilenameRef.current = file.name
      setValue('goalsAndActions.filename', file.name, { shouldValidate: true })
      setSelectedFile({ name: file.name, status: FileUploadStatus.done })
      setUploadSuccess(true)
      setImagesNotIncluded(droppedImages)
    } catch (error) {
      resetAfterFailure()
      setUploadFailed(true)
      setActionError(
        formatMessage(
          isPlanRejection(error) ? m.editorPdfRejected : m.editorUploadError,
        ),
      )
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
    setUploadFailed(true)
    resetAfterFailure()
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
    // Not a failure — the empty filename blocks from here, with zod's message.
    setUploadFailed(false)
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
                actionId: draftActionId(
                  ApiActions.getEqualityReportTemplateDocx,
                ),
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
          <AlertMessage
            type="error"
            title={formatMessage(messages.errors.alertTitle)}
            message={actionError}
          />
        </Box>
      )}

      <InputFileUpload
        name="equalityReportUpload"
        files={selectedFile ? [selectedFile] : []}
        disabled={isUploading}
        description={formatMessage(m.editorSupportedFileTypes)}
        buttonLabel={formatMessage(m.editorUploadFile)}
        accept={['.pdf', '.txt', '.docx']}
        multiple={false}
        onChange={handleFilesChanged}
        onRemove={handleRemove}
        onUploadRejection={handleUploadRejection}
        errorMessage={rejectionMessage ?? blockMessage ?? fieldError}
      />

      {uploadSuccess && (
        <Box marginTop={3}>
          <AlertMessage
            type="success"
            message={formatMessage(m.editorUploadSuccess)}
          />
        </Box>
      )}

      {uploadSuccess && imagesNotIncluded && (
        <Box marginTop={2}>
          <AlertMessage
            type="info"
            message={formatMessage(m.editorImagesNotIncluded)}
          />
        </Box>
      )}
    </Box>
  )
}

export default Editor
