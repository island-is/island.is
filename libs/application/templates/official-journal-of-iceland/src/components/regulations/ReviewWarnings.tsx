/**
 * Ported from: libs/portals/admin/regulations-admin/src/components/EditReviewWarnings.tsx
 *
 * Displays validation warnings before regulation submission.
 *
 * Key adaptations:
 * - Works with application answers, not DraftingState
 * - Uses collectRegulationWarnings utility instead of isDraftErrorFree
 * - Groups warnings by section and shows navigation links
 */
import {
  Box,
  Text,
  AlertMessage,
  Stack,
  BulletList,
  Bullet,
  Button,
} from '@island.is/island-ui/core'
import { useMemo } from 'react'
import {
  collectRegulationWarnings,
  RegulationWarning,
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
  goToScreen?: (screenId: string) => void
}

type WarningGroup = {
  section: string
  route: string
  sectionLabel: string
  warnings: RegulationWarning[]
}

const groupWarningsBySection = (
  warnings: RegulationWarning[],
): WarningGroup[] => {
  const groups: Record<string, WarningGroup> = {}

  for (const warning of warnings) {
    const key = warning.section ?? 'other'
    if (!groups[key]) {
      groups[key] = {
        section: key,
        route: warning.route ?? '',
        sectionLabel: warning.sectionLabel ?? key,
        warnings: [],
      }
    }
    groups[key].warnings.push(warning)
  }

  return Object.values(groups)
}

export const ReviewWarnings = ({
  answers,
  goToScreen,
}: ReviewWarningsProps) => {
  const warnings = useMemo(() => collectRegulationWarnings(answers), [answers])

  if (!warnings.length) {
    return null
  }

  const groups = groupWarningsBySection(warnings)

  return (
    <Box marginBottom={4}>
      <Text variant="h3" as="h3" marginBottom={3}>
        Fylla þarf út eftirfarandi reiti
      </Text>
      <Stack space={2}>
        {groups.map((group) => (
          <AlertMessage
            key={group.section}
            type="warning"
            title={group.sectionLabel}
            message={
              <Stack space={2}>
                <BulletList color="black">
                  {group.warnings.map((warning, i) => (
                    <Bullet key={i}>{warning.message}</Bullet>
                  ))}
                </BulletList>
                {goToScreen && group.route && (
                  <Button
                    onClick={() => goToScreen(group.route)}
                    size="small"
                    variant="text"
                    preTextIcon="arrowBack"
                  >
                    {`Opna kafla ${group.sectionLabel}`}
                  </Button>
                )}
              </Stack>
            }
          />
        ))}
      </Stack>
    </Box>
  )
}
