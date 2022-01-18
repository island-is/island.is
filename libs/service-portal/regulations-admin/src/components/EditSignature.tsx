import * as s from '../utils/styles.css'

import React, { useEffect, useMemo, useState } from 'react'
import {
  AlertMessage,
  Box,
  Button,
  Checkbox,
  Column,
  Columns,
  DatePicker,
  Inline,
  Input,
  InputFileUpload,
  fileToObject,
  UploadFile,
  Text,
  Divider,
} from '@island.is/island-ui/core'
import { StepComponent } from '../state/useDraftingState'
import { editorMsgs as msg } from '../messages'
import { getMinPublishDate, useLocale } from '../utils'

import { RegDraftForm } from '../state/types'
import { EditorInput } from './EditorInput'
import { URLString, useShortState } from '@island.is/regulations'
import { produce } from 'immer'
import { downloadUrl } from '../utils/files'

// ---------------------------------------------------------------------------

// // DECIDE: Will this ever be ised?
// import { useMinistriesQuery } from '../utils/dataHooks'
//
// const useMinistryOptions = (ministry: string | undefined) => {
//   const ministries = useMinistriesQuery().data
//   return useMemo(() => {
//     const ministryOptions = (ministries || []).map((m) => ({
//       label: m.name,
//       value: m.name,
//     }))
//     const selectedMinistryOption = ministryOptions.find(
//       (m) => m.value === ministry,
//     )
//     const ministryName = selectedMinistryOption?.label
//
//     return {
//       ministryOptions,
//       selectedMinistryOption,
//       ministryName,
//     }
//   }, [ministry, ministries])
// }

// ---------------------------------------------------------------------------

const fetchPDF = (pdfUrl: URLString, draft: RegDraftForm) => {
  new Promise<{ success: boolean }>((resolve) => {
    const fileName = draft.title.value + '.pdf'
    // import { downloadUrl } from '../utils/files'
    // downloadUrl (...)
    setTimeout(() => {
      alert(`Save your file "${fileName}"`)
      resolve({ success: true })
    }, 500)
  })
}

// ---------------------------------------------------------------------------

type UploadResults =
  | { location: URLString; error?: never }
  | { location?: never; error: string }

const uploadPDF = (file: File, draft: RegDraftForm) =>
  new Promise<UploadResults>((resolve) => {
    setTimeout(() => {
      resolve({
        location: `https://files.reglugerd.is/admin-drafts/${draft.id}/${file.name}` as URLString,
      })
    }, 500)
  })

type UploadingState =
  | { uploading: false; file?: never; error?: string }
  | { uploading: false; file: [UploadFile]; error?: never }
  | { uploading: true; file?: never; error?: never }

const useSignedUploader = (
  draft: RegDraftForm,
  setUrl: (location: URLString | undefined) => void,
) => {
  const signedDocumentUrl = draft.signedDocumentUrl.value
  const [uploadStatus, setUploadStatus] = useState<UploadingState>({
    uploading: false,
  })
  const downloadSignablePDF = signedDocumentUrl
    ? () => fetchPDF(signedDocumentUrl, draft)
    : () => undefined

  let reader: FileReader | undefined

  const uploadSignedPDF = (newFiles: Array<File>) => {
    const [newFile] = newFiles
    const newUploadFile = fileToObject(newFile)
    const _reader = (reader = new FileReader())
    _reader.onabort = () => console.log('file reading was aborted')
    _reader.onerror = () => console.log('file reading has failed')
    _reader.onload = () => {
      // Do whatever you want with the file contents
      const binaryStr = _reader.result
      console.log(binaryStr)
    }
    _reader.readAsArrayBuffer(newFile)

    setUploadStatus({ uploading: true })

    uploadPDF(newFile, draft).then(({ location, error }) => {
      if (!uploadStatus.uploading) {
        location && setUrl(location)
        setUploadStatus({ uploading: false, error })
      }
    })
  }
  const cancelUpload = () => {
    reader && reader.abort()
    setUploadStatus(
      produce((draft) => {
        draft.uploading = false
      }),
    )
  }
  const retryUpload = ({ originalFileObj }: UploadFile) =>
    originalFileObj instanceof File && uploadSignedPDF([originalFileObj])

  const [previousDocUrl, setPreviousDocUrl] = useShortState<
    URLString | undefined
  >()
  const undoPeriod = 5000
  const clearSignedPDF = () => {
    setPreviousDocUrl(signedDocumentUrl, undoPeriod)
    setUrl(undefined)
  }
  const undoClearSignedPDF = () => {
    setPreviousDocUrl(undefined)
    setUrl(previousDocUrl)
  }

  useEffect(() => {
    // reset uploadStatus whenever signedDocumentUrl changes.
    // use immer to prevent unneccessary re-render
    setUploadStatus(
      produce((draft) => {
        draft.uploading = false
        delete draft.error
      }),
    )
  }, [signedDocumentUrl])

  return {
    uploadStatus,
    downloadSignablePDF,
    uploadSignedPDF,
    cancelUpload,
    retryUpload,
    previousDocUrl,
    undoPeriod,
    clearSignedPDF,
    undoClearSignedPDF,
  }
}

// ===========================================================================

export const EditSignature: StepComponent = (props) => {
  const { formatMessage: t, formatDateFns } = useLocale()
  const { draft, actions } = props
  const { updateState } = actions

  const signedDocumentUrl = draft.signedDocumentUrl.value

  const {
    uploadStatus,
    downloadSignablePDF,
    uploadSignedPDF,
    cancelUpload,
    retryUpload,
    previousDocUrl,
    undoPeriod,
    clearSignedPDF,
    undoClearSignedPDF,
  } = useSignedUploader(draft, (location) =>
    updateState('signedDocumentUrl', location),
  )

  return (
    <Box marginBottom={6}>
      <Box marginBottom={4}>
        <Button onClick={downloadSignablePDF} icon="download">
          {t(msg.signedDocumentDownloadFresh)}
        </Button>
      </Box>

      <Box marginBottom={4}>
        <InputFileUpload
          fileList={uploadStatus.file || []}
          header={t(msg.signedDocumentUploadDragPrompt)}
          description={
            t(msg.signedDocumentUploadDescr).replace(/^\s+$/, '') || undefined
          }
          buttonLabel={t(msg.signedDocumentUpload)}
          onChange={uploadSignedPDF}
          onRetry={retryUpload}
          onRemove={cancelUpload}
          errorMessage={uploadStatus.error}
          accept=".pdf"
          multiple={false}
        />
        {uploadStatus.error && (
          <AlertMessage type="error" title={uploadStatus.error} />
        )}
      </Box>

      {previousDocUrl && (
        <Box
          marginBottom={3}
          style={
            {
              '--fade-duration': 0.5 * undoPeriod,
              '--fade-delay': 0.5 * undoPeriod,
            } as React.CSSProperties
          }
          className={s.fadeOut}
        >
          <Button
            onClick={undoClearSignedPDF}
            variant="text"
            as="button"
            icon="reload"
            disabled={uploadStatus.uploading}
          >
            {t(msg.signedDocumentClearUndo)}
          </Button>
        </Box>
      )}

      {signedDocumentUrl != null && (
        <>
          <Box marginBottom={3} display="flex" flexWrap="wrap">
            <Inline space={2} flexWrap="wrap">
              <strong>{signedDocumentUrl.split('/').pop()}</strong>

              <Button
                onClick={() => downloadUrl(signedDocumentUrl)}
                variant="text"
                size="small"
                as="button"
                iconType="outline"
                icon="download"
                title={t(msg.signedDocumentLink)}
                aria-label={t(msg.signedDocumentLink)}
              >
                {t(msg.signedDocumentLink)}
              </Button>

              <Button
                onClick={clearSignedPDF}
                variant="text"
                size="small"
                as="button"
                iconType="outline"
                icon="close"
                disabled={uploadStatus.uploading}
                title={t(msg.signedDocumentClearLong)}
                aria-label={t(msg.signedDocumentClearLong)}
              >
                {t(msg.signedDocumentClear)}
              </Button>
            </Inline>
          </Box>
          <Box marginBottom={3}>
            <Divider />
            {' '}
          </Box>

          <Box marginBottom={5}>
            <Text variant="h3" as="h5" marginBottom={2}>
              {t(msg.signatureText)}
            </Text>
            <EditorInput
              label={t(msg.signatureText)}
              hiddenLabel
              draftId={draft.id}
              value={draft.signatureText.value}
              onChange={(text) => updateState('signatureText', text)}
              required={draft.signatureText.required}
              error={t(draft.signatureText.error)}
            />
          </Box>

          <Columns space={3} collapseBelow="lg">
            <Column>
              <Box marginBottom={3}>
                {/* Signature Date (derived from signatureText) */}
                <Input
                  label={t(msg.signatureDate)}
                  value={
                    (draft.signatureDate.value &&
                      formatDateFns(draft.signatureDate.value, 'dd/MM/yyyy')) ||
                    ''
                  }
                  placeholder={t(msg.signatureDatePlaceholder)}
                  hasError={!!draft.signatureDate.error}
                  errorMessage={t(draft.signatureDate.error)}
                  name="_signatureDate"
                  size="sm"
                  readOnly
                />
              </Box>
            </Column>

            <Column>
              <Box marginBottom={3}>
                {/* Ministry (derived from signatureText) */}
                <Input
                  label={t(msg.ministry)}
                  value={draft.ministry.value || ''}
                  placeholder={t(msg.ministryPlaceholder)}
                  hasError={!!draft.ministry.error}
                  errorMessage={t(draft.ministry.error)}
                  name="_rn"
                  size="sm"
                  readOnly
                />
              </Box>
            </Column>
          </Columns>

          <Box>
            <Inline space="gutter" alignY="center">
              {/* idealPublishDate Input */}
              <DatePicker
                size="sm"
                label={t(msg.idealPublishDate)}
                placeholderText={t(msg.idealPublishDate_default)}
                minDate={getMinPublishDate(
                  draft.fastTrack.value,
                  draft.signatureDate.value,
                )}
                selected={draft.idealPublishDate.value}
                handleChange={(date: Date) =>
                  updateState('idealPublishDate', date, true)
                }
                hasError={!!draft.idealPublishDate.error}
                errorMessage={t(draft.idealPublishDate.error)}
                backgroundColor="blue"
              />
              {/* Request fastTrack */}
              <Checkbox
                label={t(msg.applyForFastTrack)}
                labelVariant="default"
                checked={draft.fastTrack.value}
                onChange={() => {
                  updateState('fastTrack', !draft.fastTrack.value)
                }}
              />
            </Inline>
          </Box>
          <Box marginBottom={3}>
            {/* Clear idealPublishDate */}
            {!!draft.idealPublishDate.value && (
              <Button
                size="small"
                variant="text"
                preTextIcon="close"
                onClick={() => {
                  updateState('idealPublishDate', undefined)
                }}
              >
                {t(msg.idealPublishDate_default)}
              </Button>
            )}
          </Box>
        </>
      )}
    </Box>
  )
}
