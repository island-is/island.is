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
  Option,
  Select,
} from '@island.is/island-ui/core'
import { StepComponent } from '../state/useDraftingState'
import { editorMsgs as msg } from '../messages'
import { getMinPublishDate, useLocale } from '../utils'
import { useMinistriesQuery } from '@island.is/service-portal/graphql'

import { RegDraftForm } from '../state/types'
import { EditorInput } from './EditorInput'
import { MinistrySlug, URLString, useShortState } from '@island.is/regulations'
import { produce } from 'immer'

// ---------------------------------------------------------------------------

const useMinistryOptions = (ministrySlug: MinistrySlug | undefined) => {
  const ministries = useMinistriesQuery().data
  return useMemo(() => {
    const ministryOptions = (ministries || []).map((m) => ({
      label: m.name,
      value: m.slug,
    }))
    const selectedMinistryOption = ministryOptions.find(
      (m) => m.value === ministrySlug,
    )
    const ministryName = selectedMinistryOption?.label

    return {
      ministryOptions,
      selectedMinistryOption,
      ministryName,
    }
  }, [ministrySlug, ministries])
}

// ---------------------------------------------------------------------------

const fetchPDF = (pdfUrl: URLString, draft: RegDraftForm) => {
  new Promise<{ success: boolean }>((resolve) => {
    const fileName = draft.title.value + '.pdf'
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

const uploadPDF = (draft: RegDraftForm) =>
  new Promise<UploadResults>((resolve) => {
    const fileName = draft.title.value + '.pdf'
    setTimeout(() => {
      resolve({
        location: `https://files.reglugerd.is/admin-drafts/${draft.id}/${fileName}` as URLString,
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

    uploadPDF(draft).then(({ location, error }) => {
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
  const undoPeriod = 4000
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
    ministryOptions,
    selectedMinistryOption,
    ministryName,
  } = useMinistryOptions(draft.ministry.value)

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
    <>
      <Box marginBottom={4}>
        <Button onClick={downloadSignablePDF} icon="download">
          {t(msg.signedDocumentDownloadFresh)}
        </Button>
      </Box>

      <Box marginBottom={6}>
        <InputFileUpload
          fileList={uploadStatus.file || []}
          header={t(msg.signedDocumentUploadDragPrompt)}
          description={t(msg.signedDocumentUploadDescr) || undefined}
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
              '--fade-duration': 0.67 * undoPeriod,
              '--fade-delay': 0.33 * undoPeriod,
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
          <Box marginBottom={3}>
            <strong>
              <a
                href={signedDocumentUrl}
                download={signedDocumentUrl.split('/').pop()}
              >
                {t(msg.signedDocumentLink)}
              </a>
            </strong>

            <Button
              onClick={clearSignedPDF}
              variant="text"
              as="button"
              icon="closeCircle"
              disabled={uploadStatus.uploading}
              title={t(msg.signedDocumentClearLong)}
              aria-label={t(msg.signedDocumentClearLong)}
            >
              {t(msg.signedDocumentClear)}
            </Button>
          </Box>

          <Box marginBottom={3}>
            <EditorInput
              label={t(msg.signatureText)}
              draftId={draft.id}
              value={draft.signatureText.value}
              onChange={(text) => updateState('signatureText', text)}
            />
          </Box>

          <Columns space={3} collapseBelow="lg">
            <Column>
              <Box marginBottom={3}>
                <Input
                  label={t(msg.signatureDate)}
                  value={
                    draft.signatureDate.value &&
                    formatDateFns(draft.signatureDate.value, 'dd/mm/yyyy')
                  }
                  placeholder={t(msg.signatureDatePlaceholder)}
                  name="_signatureDate"
                  size="sm"
                  readOnly
                />
              </Box>
            </Column>

            <Column>
              <Box marginBottom={3}>
                {draft.ministry.value ? (
                  <Input
                    label={t(msg.ministry)}
                    value={ministryName || draft.ministry.value}
                    placeholder={t(msg.ministryPlaceholder)}
                    name="_rn"
                    size="sm"
                    readOnly
                  />
                ) : (
                  <Select
                    name="type-select"
                    label={t(msg.ministry)}
                    placeholder={t(msg.ministryPlaceholder)}
                    size="sm"
                    isSearchable={false}
                    options={ministryOptions}
                    value={selectedMinistryOption}
                    required
                    errorMessage={t(draft.ministry.error)}
                    hasError={!!draft.ministry.error}
                    onChange={(typeOption) =>
                      updateState(
                        'ministry',
                        (typeOption as Option).value as MinistrySlug,
                        true,
                      )
                    }
                    backgroundColor="blue"
                  />
                )}
              </Box>
            </Column>
          </Columns>

          <Box>
            <Inline space="gutter" alignY="center">
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
        </>
      )}
      <Box marginBottom={6}>
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
  )
}
