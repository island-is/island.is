import * as s from '../utils/styles.css'

import React, { useEffect, useState } from 'react'
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
import { useDraftingState } from '../state/useDraftingState'
import { editorMsgs as msg } from '../messages'
import { getMinPublishDate } from '../utils'

import { RegDraftForm } from '../state/types'
import { EditorInput } from './EditorInput'
import {
  HTMLText,
  PlainText,
  URLString,
  useShortState,
} from '@island.is/regulations'
import { produce } from 'immer'
import { downloadUrl } from '../utils/files'
import { DownloadDraftButton } from './DownloadDraftButton'
import { useAuth } from '@island.is/auth/react'
import { useLocale } from '@island.is/localization'
import { useS3Upload } from '../utils/dataHooks'
import { PresignedPost } from '@island.is/regulations/admin'

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

const defaultSignatureText = `
  <p class="Dags" align="center"><em>{ministry}nu, {dags}.</em></p>
  <p class="FHUndirskr" align="center">f.h.r.</p>
  <p class="Undirritun" align="center"><strong>NAFN</strong><br/>{minister}.</p>
  <p class="Undirritun" align="right"><em>NAFN.</em></p>
` as HTMLText

const getDefaultSignatureText = (
  dateFormatter: (date: Date, str?: string) => string,
  /** The ministry of the author-type user that created the RegulationDraft */
  authorMinistry?: PlainText,
) => {
  const authorMinister =
    authorMinistry && authorMinistry.replace(/uneyti$/i, '') + 'herra'
  const defaultMinistry = '⸻ráðuneyti'
  const defaultMinister = '⸻ráðherra'

  return defaultSignatureText
    .replace('{dags}', dateFormatter(new Date(), 'dd. MMMM yyyy'))
    .replace('{ministry}', authorMinistry || defaultMinistry)
    .replace('{minister}', authorMinister || defaultMinister) as HTMLText
}

// ===========================================================================

export const EditSignature = () => {
  const { formatMessage: t, formatDateFns } = useLocale()
  const { draft, actions } = useDraftingState()
  const { updateState } = actions

  const {
    uploadFile,
    uploadErrorMessage,
    uploadLocation,
    onChange,
    onRetry,
    onRemove,
  } = useS3Upload()
  return (
    <Box marginBottom={6}>
      <Box marginBottom={4}>
        <DownloadDraftButton draftId={draft.id} />
      </Box>

      <Box marginBottom={4}>
        <InputFileUpload
          fileList={uploadFile ? [uploadFile] : []}
          header={t(msg.signedDocumentUploadDragPrompt)}
          description={
            t(msg.signedDocumentUploadDescr).replace(/^\s+$/, '') || undefined
          }
          buttonLabel={t(msg.signedDocumentUpload)}
          onChange={onChange}
          onRetry={onRetry}
          onRemove={onRemove}
          errorMessage={uploadErrorMessage}
          accept=".pdf"
          multiple={false}
        />
        {uploadErrorMessage && (
          <AlertMessage type="error" title={uploadErrorMessage} />
        )}
      </Box>

      {/*uploadLocation && (
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
      )*/}

      {uploadLocation != null && (
        <>
          <Box marginBottom={3} display="flex" flexWrap="wrap">
            <Inline space={2} flexWrap="wrap">
              <strong>{uploadLocation.split('/').pop()}</strong>

              <Button
                onClick={() => downloadUrl(uploadLocation)}
                variant="text"
                size="small"
                as="button"
                iconType="outline"
                icon="download"
                title={t(msg.signedDocumentLinkLong)}
                aria-label={t(msg.signedDocumentLinkLong)}
              >
                {t(msg.signedDocumentLink)}
              </Button>

              <Button
                onClick={uploadFile ? () => onRemove(uploadFile) : undefined}
                variant="text"
                size="small"
                as="button"
                iconType="outline"
                icon="close"
                disabled={uploadFile?.status === 'uploading'}
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
              value={
                draft.signatureText.value ||
                getDefaultSignatureText(
                  formatDateFns,
                  /* authorNotEditorMinistry */
                )
              }
              onChange={(text) => updateState('signatureText', text)}
              required={!!draft.signatureText.required}
              error={
                draft.signatureText.showError &&
                draft.signatureText.error &&
                t(draft.signatureText.error)
              }
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
                  hasError={
                    draft.signatureDate.showError && !!draft.signatureDate.error
                  }
                  errorMessage={
                    draft.signatureDate.error && t(draft.signatureDate.error)
                  }
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
                  hasError={!!draft.ministry.error && draft.ministry.showError}
                  errorMessage={draft.ministry.error && t(draft.ministry.error)}
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
                  updateState('idealPublishDate', date)
                }
                hasError={
                  draft.idealPublishDate.showError &&
                  !!draft.idealPublishDate.error
                }
                errorMessage={
                  draft.idealPublishDate.error &&
                  t(draft.idealPublishDate.error)
                }
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
