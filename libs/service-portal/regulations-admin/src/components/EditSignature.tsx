import React, { useMemo, useState } from 'react'
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
  Option,
  Select,
} from '@island.is/island-ui/core'
import { StepComponent } from '../state/useDraftingState'
import { editorMsgs as msg } from '../messages'
import { getMinPublishDate, useLocale } from '../utils'
import { useMinistriesQuery } from '@island.is/service-portal/graphql'

import { RegDraftForm } from '../state/types'
import { EditorInput } from './EditorInput'
import { MinistrySlug, URLString } from '@island.is/regulations'

// ---------------------------------------------------------------------------

const fetchPDF = (draft: RegDraftForm) =>
  new Promise<{ success: boolean }>((resolve) => {
    const fileName = draft.title.value + '.pdf'
    setTimeout(() => {
      alert(`Save your file "${fileName}"`)
      resolve({ success: true })
    }, 500)
  })

type UploadResults =
  | { location: URLString; error?: never }
  | { location?: never; error: string }

const uploadPDF = (draft: RegDraftForm) =>
  new Promise<UploadResults>((resolve) => {
    alert('Select file to upload')
    const fileName = draft.title.value + '.pdf'
    setTimeout(() => {
      resolve({
        location: `https://files.reglugerd.is/admin-drafts/${draft.id}/${fileName}` as URLString,
      })
    }, 500)
  })

type UploadingState =
  | { uploading: false; error?: string }
  | { uploading: true; error?: never }

export const EditSignature: StepComponent = (props) => {
  const { formatMessage: t, formatDateFns } = useLocale()
  const { draft, actions } = props
  const { updateState } = actions

  const [uploadState, setUploadState] = useState<UploadingState>({
    uploading: false,
  })

  const ministries = useMinistriesQuery().data
  const ministrySlug = draft.ministry.value
  const { ministryOptions, ministryOption, ministryName } = useMemo(() => {
    const ministryOptions = (ministries || []).map((m) => ({
      label: m.name,
      value: m.slug,
    }))
    const ministryOption = ministryOptions.find((m) => m.value === ministrySlug)
    const ministryName = ministryOption?.label

    return {
      ministryOptions,
      ministryOption,
      ministryName,
    }
  }, [ministrySlug, ministries])

  const downloadSignablePDF = () => fetchPDF(draft)
  const uploadSignedPDF = () => {
    setUploadState({ uploading: true })
    uploadPDF(draft).then(({ location, error }) => {
      location && updateState('signedDocumentUrl', location)
      setUploadState({ uploading: false, error })
    })
  }

  const alreadyUploaded = draft.signedDocumentUrl.value

  return (
    <>
      <Box marginBottom={4}>
        <Button onClick={downloadSignablePDF} icon="download">
          {t(msg.signedDocumentDownloadFresh)}
        </Button>
      </Box>

      <Box marginBottom={6}>
        {uploadState.error && (
          <AlertMessage type="error" title={uploadState.error} />
        )}
        <Button
          onClick={uploadSignedPDF}
          icon="document"
          disabled={uploadState.uploading}
        >
          {t(
            uploadState.uploading
              ? msg.signedDocumentUploading
              : msg.signedDocumentUpload,
          )}
        </Button>
      </Box>

      {alreadyUploaded && (
        <>
          <Box marginBottom={3}>
            <strong>
              <a
                href={draft.signedDocumentUrl.value}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t(msg.signedDocumentLink)}
              </a>
            </strong>
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
                    value={ministryOption}
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
      )}
    </>
  )
}
