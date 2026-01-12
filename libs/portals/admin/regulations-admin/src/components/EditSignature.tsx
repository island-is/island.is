import { useEffect, useState } from 'react'
import {
  AlertMessage,
  Box,
  Button,
  Column,
  Columns,
  Inline,
  Input,
  InputFileUploadDeprecated,
  Text,
  Divider,
} from '@island.is/island-ui/core'
import { useDraftingState } from '../state/useDraftingState'
import { editorMsgs as msg } from '../lib/messages'

import { EditorInput } from './EditorInput'
import { HTMLText, PlainText, URLString } from '@island.is/regulations'
import { downloadUrl } from '../utils/files'
import { DownloadDraftButton } from './DownloadDraftButton'
import { useLocale } from '@island.is/localization'
import { useS3Upload } from '../utils/dataHooks'
import { formatDate } from '../utils/formatAmendingUtils'

// ---------------------------------------------------------------------------

const defaultSignatureText = `
  <p class="Dags" align="center"><em>{ministry}nu, {dags}.</em></p>
  <p class="FHUndirskr" align="center">F. h. r.</p>
  <p class="Undirritun" align="center"><strong>NAFN</strong></p>
  <p class="Undirritun" align="right"><em>NAFN.</em></p>
` as HTMLText

const getDefaultSignatureText = (
  /** The ministry of the author-type user that created the RegulationDraft */
  authorMinistry?: PlainText,
) => {
  const authorMinister =
    authorMinistry && authorMinistry.replace(/uneyti$/i, '') + 'herra'
  const defaultMinistry = '⸻ráðuneyti'
  const defaultMinister = '⸻ráðherra'

  return defaultSignatureText
    .replace('{dags}', formatDate(new Date()))
    .replace('{ministry}', authorMinistry || defaultMinistry)
    .replace('{minister}', authorMinister || defaultMinister) as HTMLText
}

// ===========================================================================

export const EditSignature = () => {
  const { formatMessage: t, formatDateFns } = useLocale()
  const { draft, actions } = useDraftingState()
  const { updateState } = actions
  // Empty string is necessesary. If signedDocumentUrl is undefined the database value for the draft
  // doesn't get updated.
  const [uploadUrl, setUploadUrl] = useState(
    draft.signedDocumentUrl.value ?? '',
  )

  const {
    uploadLocation,
    uploadStatus,
    resetUploadLocation,
    onChange,
    onRetry,
  } = useS3Upload()

  const onRemove = () => {
    resetUploadLocation()
    //Ugly
    setUploadUrl('')
  }

  useEffect(() => {
    updateState('signedDocumentUrl', uploadUrl as URLString)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadUrl])

  useEffect(() => {
    if (uploadLocation) {
      setUploadUrl(uploadLocation as URLString)
    }
  }, [uploadLocation])

  return (
    <Box marginBottom={6}>
      <Box marginBottom={4}>
        <DownloadDraftButton draftId={draft.id} />
      </Box>
      <Box marginBottom={4}>
        <InputFileUploadDeprecated
          fileList={[]}
          header={t(msg.signedDocumentUploadDragPrompt)}
          description={
            t(msg.signedDocumentUploadDescr).replace(/^\s+$/, '') || undefined
          }
          buttonLabel={t(msg.signedDocumentUpload)}
          onChange={(files) => onChange(files, draft.id)}
          onRetry={(file) => onRetry(file as File, draft.id)}
          onRemove={resetUploadLocation}
          accept=".pdf"
          multiple={false}
        />
        {uploadStatus.error && (
          <AlertMessage type="error" title={uploadStatus.error} />
        )}
      </Box>
      {draft.signedDocumentUrl.value && (
        <>
          <Box marginBottom={3} display="flex" flexWrap="wrap">
            <Inline space={2} flexWrap="wrap">
              <strong>
                {String(draft.signedDocumentUrl.value).split('/').pop()}
              </strong>

              <Button
                onClick={() =>
                  downloadUrl(String(draft.signedDocumentUrl.value))
                }
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
                onClick={onRemove}
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
              value={
                draft.signatureText.value ||
                getDefaultSignatureText(draft.ministry.value)
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
