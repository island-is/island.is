import React, { ReactNode } from 'react'
import { Box, Button, Inline, Text, Divider } from '@island.is/island-ui/core'
import { useHistory } from 'react-router'
import { editorMsgs, reviewMessagse } from '../messages'
import { useDraftingState } from '../state/useDraftingState'
import { useLocale } from '../utils'
import { downloadUrl } from '../utils/files'
import { Step } from '../types'
import { JumpToStep } from './EditReviewWarnings'
import { RegDraftForm } from '../state/types'

/** Mock PDF fetchher.
 *
 * TODO: Implement true POST action that generates a full PDF
 * (signatureText and all) and downloads it automatically
 */
const generateAndDownloadPdf = (draft: RegDraftForm) => {
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

const prettyJoin = <T,>(arr: Array<T>): Array<string | T> =>
  arr.flatMap((item, i) => {
    const separator = i === 0 ? '' : i === arr.length - 1 ? ' og ' : ', '
    return separator ? [separator, item] : item
  })

// ---------------------------------------------------------------------------

type OverviewItemProps = {
  label: string
  children: ReactNode
  step?: Step
}
const OverviewItem = (props: OverviewItemProps) => {
  const { label, step } = props
  return (
    <Box marginBottom={2}>
      <Text fontWeight="semiBold">{label}:</Text>
      {step && <JumpToStep step={step} label={label} />} {props.children}
    </Box>
  )
}

// ---------------------------------------------------------------------------

export type EditReviewOverviewProps = {
  hasWarnings: boolean
}

export const EditReviewOverview = (props: EditReviewOverviewProps) => {
  const { draft, lawChapters } = useDraftingState()
  const { formatMessage, formatDateFns } = useLocale()
  const t = formatMessage
  const { hasWarnings } = props

  const formatDate = (date?: Date, format?: string) =>
    date ? formatDateFns(date, format || 'dd MMMM yyyy') : ''

  if (hasWarnings) {
    return null
  }

  const typeName = t(
    draft.type.value === 'amending'
      ? editorMsgs.type_amending
      : editorMsgs.type_base,
  )

  return (
    <Box marginBottom={4}>
      <OverviewItem label={t(editorMsgs.title)} step="basics">
        {draft.title.value}
        <br />({typeName})
      </OverviewItem>

      {draft.appendixes.length > 0 && (
        <OverviewItem label={t(editorMsgs.appendixes)} step="basics">
          {prettyJoin(draft.appendixes.map((a) => '„' + a.title.value + '“'))}
        </OverviewItem>
      )}

      <OverviewItem label={t(editorMsgs.effectiveDate)} step="meta">
        {formatDate(draft.effectiveDate.value) ||
          t(editorMsgs.effectiveDate_default)}
      </OverviewItem>

      <OverviewItem label={t(editorMsgs.lawChapters)} step="meta">
        {prettyJoin(
          draft.lawChapters.value.map(
            (slug) => '„' + lawChapters.bySlug[slug] + '“',
          ),
        )}
      </OverviewItem>

      <OverviewItem label={t(editorMsgs.signatureDate)} step="signature">
        {draft.ministry.value}nu, {formatDate(draft.signatureDate.value)}
      </OverviewItem>

      <OverviewItem label={t(editorMsgs.idealPublishDate)} step="signature">
        {formatDate(draft.idealPublishDate.value) ||
          t(editorMsgs.idealPublishDate_default)}
        {draft.fastTrack.value ? ` (${t(editorMsgs.applyForFastTrack)})` : ''}
      </OverviewItem>

      {/*
        TODO: Add impacts, listed by target-regulation
      */}

      <Box marginTop={[4, 4, 8]} marginBottom={[4, 4, 8]}>
        <Box marginBottom={[0, 0, 2]}>
          <Divider />
          {' '}
        </Box>

        <Inline space={[2, 2, 3, 4]} align="center" alignY="center">
          {/* TODO: Útbúa state sem heldur utan um hvort smellt hafi verið á takkana.  */}
          {/* TODO: Setja inn takka til að afrita titil, texta og fleiri gildi  */}

          <Button
            as="button"
            onClick={() => downloadUrl(draft.signedDocumentUrl.value!)}
            // Props for "fresh" state:
            variant="ghost"
            size="small"
            iconType="outline"
            icon="download"
          >
            {t(reviewMessagse.downloadSignedDocument)}
          </Button>

          <span>—</span>

          <Button
            as="button"
            onClick={() => generateAndDownloadPdf(draft)}
            // Props for "clicked" state:
            variant="text"
            preTextIconType="outline"
            preTextIcon="checkmark"
          >
            {t(reviewMessagse.downloadPDFVersion)}
          </Button>
        </Inline>
      </Box>
    </Box>
  )
}
