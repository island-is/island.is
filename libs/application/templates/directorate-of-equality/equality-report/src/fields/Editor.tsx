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
import mammoth from 'mammoth'
import { FileRejection } from 'react-dropzone'
import { useMutation } from '@apollo/client'
import { UPDATE_APPLICATION_EXTERNAL_DATA } from '@island.is/application/graphql'
import { useLocale } from '@island.is/localization'
import { ApiActions, draftActionId } from '../utils/constants'
import { escapeHtml, htmlToPlainText } from '../utils/htmlHelpers'
import {
  EqualityContentPayload,
  useEnsureEqualityDraft,
  useEqualityContentPush,
} from '../utils/useEqualityDraft'

interface Props extends FieldBaseProps {
  field: CustomField
}

/**
 * Mirrors DMR's 4MB cap on a decoded PDF.
 *
 * Not an arbitrary UX limit: the file rides as base64 inside a GraphQL
 * variable, and base64 inflates by 4/3 against DMR's own request-body ceiling.
 * Raising it here alone would just move the rejection later.
 */
const MAX_PDF_BYTES = 4 * 1024 * 1024

/**
 * Reads a File into base64, without the data-URI prefix `readAsDataURL` adds.
 *
 * Chunked rather than `String.fromCharCode(...bytes)`: spreading a
 * multi-megabyte array into an argument list overflows the call stack well
 * below the 4MB this has to handle.
 */
const fileToBase64 = async (file: File): Promise<string> => {
  const bytes = new Uint8Array(await file.arrayBuffer())
  const CHUNK = 0x8000
  let binary = ''

  for (let i = 0; i < bytes.length; i += CHUNK) {
    binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK))
  }

  return btoa(binary)
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
  const { pushDraftContent, pushRetryContent } = useEqualityContentPush()

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

  // Kept out of the disabled flag above: a button greyed out on arrival
  // explains nothing, so the untouched case blocks on press with a reason.
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
    })
  }, [
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

    try {
      const name = file.name.toLowerCase()
      let payload: EqualityContentPayload

      if (name.endsWith('.pdf')) {
        /*
         * Uploaded as-is, with no conversion — that is the point of accepting
         * PDFs. The company's layout, tables and images survive, where mammoth
         * would have flattened them.
         *
         * Size is checked here because the file travels as base64 inside a
         * GraphQL variable, which inflates it by 4/3 against a 4MB server cap.
         * Failing on selection tells the applicant what is wrong; failing after
         * the upload just says "villa".
         */
        if (file.size > MAX_PDF_BYTES) {
          resetAfterFailure()
          setUploadFailed(true)
          setRejectionMessage(formatMessage(m.editorFileTooLarge))
          return
        }

        payload = {
          kind: 'pdf',
          base64: await fileToBase64(file),
          filename: file.name,
        }
      } else {
        let html = ''

        if (name.endsWith('.docx')) {
          const arrayBuffer = await file.arrayBuffer()
          const result = await mammoth.convertToHtml({ arrayBuffer })
          html = result.value
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
        const plainTextLength = htmlToPlainText(html).length
        if (plainTextLength === 0) {
          resetAfterFailure()
          setUploadFailed(true)
          setRejectionMessage(formatMessage(m.editorUnsupportedFile))
          return
        }

        payload = { kind: 'html', base64: Buffer.from(html).toString('base64') }
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
    } catch {
      resetAfterFailure()
      setUploadFailed(true)
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
    </Box>
  )
}

export default Editor
