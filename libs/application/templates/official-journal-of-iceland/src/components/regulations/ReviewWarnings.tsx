/**
 * Ported from: libs/portals/admin/regulations-admin/src/components/EditReviewWarnings.tsx
 *
 * Displays validation warnings before regulation submission.
 *
 * Key adaptations:
 * - Works with application answers, not DraftingState
 * - Uses collectRegulationWarnings utility instead of isDraftErrorFree
 * - No step navigation (application system handles navigation)
 */
import { Box, Text, AlertMessage } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useMemo } from 'react'
import {
  RegulationWarning,
  collectRegulationWarnings,
} from '../../utils/regulationValidations'

// ---------------------------------------------------------------------------

export type ReviewWarningsProps = {
  /** Application answers to validate */
  answers: {
    advert?: {
      department?: { title: string } | null
      type?: { title: string } | null
      title?: string
      html?: string
      requestedDate?: string
      channels?: Array<{ name?: string; email?: string; phone?: string }>
    }
    signature?: {
      regular?: {
        records?: Array<{
          institution?: string
          signatureDate?: string
        }>
      }
      committee?: {
        records?: Array<{
          institution?: string
          signatureDate?: string
        }>
      }
    }
    regulation?: {
      effectiveDate?: string
      lawChapters?: Array<{ slug: string; name: string }>
      impacts?: Array<{
        id: string
        type: 'amend' | 'repeal'
        name: string
        regTitle?: string
        date?: string
        title?: string
        text?: string
        appendixes?: Array<{ title?: string; text?: string }>
        comments?: string
        diff?: string
      }>
    }
    applicationType?: string
  }
}

export const ReviewWarnings = ({ answers }: ReviewWarningsProps) => {
  const { formatMessage: f } = useLocale()

  const warnings = useMemo(() => collectRegulationWarnings(answers), [answers])

  if (!warnings.length) {
    return null
  }

  return (
    <Box marginBottom={4}>
      <Text variant="h3" as="h3" marginBottom={3}>
        Eftirfarandi atriði þarf að laga:
      </Text>
      {warnings.map((warning, i) => (
        <Box marginBottom={2} key={i}>
          <AlertMessage
            type="error"
            title={warning.field}
            message={warning.message}
          />
        </Box>
      ))}
    </Box>
  )
}
