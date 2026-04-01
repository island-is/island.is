/**
 * Ported from: libs/portals/admin/regulations-admin/src/components/EditReviewOverview.tsx
 *
 * Displays a summary overview of the regulation before submission.
 *
 * Key adaptations:
 * - Works with application answers directly, not DraftingState
 * - Removed editor-only actions (copy HTML, download PDF, etc.)
 * - Simplified to show regulation summary in a clean format
 */
import { useMemo, ReactNode } from 'react'
import {
  Box,
  Divider,
  Inline,
  Stack,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useUserInfo } from '@island.is/react-spa/bff'
import { prettyName, RegName } from '@island.is/regulations'
import { useLawChapters } from '../../hooks/useLawChapters'
import { RegulationImpactSchema } from '../../lib/dataSchema'
import { regulation } from '../../lib/messages'

// ---------------------------------------------------------------------------

type OverviewItemProps = {
  label: string
  children: ReactNode
}

const OverviewItem = ({ label, children }: OverviewItemProps) => {
  return (
    <Box marginBottom={3}>
      <Text fontWeight="semiBold">{label}:</Text>
      {children}
    </Box>
  )
}

// ---------------------------------------------------------------------------

export type ReviewOverviewProps = {
  answers: {
    advert?: {
      department?: { title: string } | null
      type?: { title: string } | null
      title?: string
      html?: string
      additions?: Array<{ title?: string }>
      requestedDate?: string
      channels?: Array<{ name?: string; email?: string; phone?: string }>
    }
    signature?: {
      regular?: {
        records?: Array<{
          institution?: string
          signatureDate?: string
          chairman?: { name?: string }
          members?: Array<{ name?: string }>
        }>
      }
      committee?: {
        records?: Array<{
          institution?: string
          signatureDate?: string
          chairman?: { name?: string }
          members?: Array<{ name?: string }>
        }>
      }
    }
    misc?: { signatureType?: string }
    regulation?: {
      effectiveDate?: string
      lawChapters?: Array<{ slug: string; name: string }>
      fastTrack?: boolean
      impacts?: RegulationImpactSchema[]
    }
    applicationType?: string
  }
  /** Whether there are warnings — if true, the overview is hidden */
  hasWarnings: boolean
  price?: number
  priceLoading?: boolean
  priceError?: boolean
}

export const ReviewOverview = ({
  answers,
  hasWarnings,
  price,
  priceLoading,
  priceError,
}: ReviewOverviewProps) => {
  const { formatMessage: f, formatDateFns, formatNumber } = useLocale()
  const user = useUserInfo()
  const { lawChapters } = useLawChapters()

  const lawChapterNameBySlug = useMemo(
    () =>
      lawChapters.reduce<Record<string, string>>((acc, ch) => {
        acc[ch.slug] = ch.name
        return acc
      }, {}),
    [lawChapters],
  )

  if (hasWarnings) {
    return null
  }

  const typeName =
    answers.applicationType === 'amending_regulation'
      ? 'Breytingareglugerð'
      : 'Stofnreglugerð'

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—'
    try {
      return formatDateFns(new Date(dateStr), 'd. MMMM yyyy')
    } catch {
      return dateStr
    }
  }

  const advert = answers.advert
  const reg = answers.regulation
  const ministry =
    answers.signature?.regular?.records?.[0]?.institution ??
    answers.signature?.committee?.records?.[0]?.institution

  return (
    <Box>
      <OverviewItem label="Sendandi">
        <Text>{user.profile.name}</Text>
      </OverviewItem>

      <OverviewItem label="Dagsetning innsendingar">
        <Text>{new Date().toLocaleDateString('is-IS')}</Text>
      </OverviewItem>

      <OverviewItem label={f(regulation.summary.labels.title)}>
        <Text>
          {advert?.title || '—'} ({typeName})
        </Text>
      </OverviewItem>

      {advert?.additions && advert.additions.length > 0 && (
        <OverviewItem label="Viðaukar">
          <Text>
            {advert.additions
              .map((a) => '„' + (a.title || '') + '"')
              .join(', ')}
          </Text>
        </OverviewItem>
      )}

      <OverviewItem label={f(regulation.summary.labels.effectiveDate)}>
        <Text>
          {reg?.effectiveDate
            ? formatDate(reg.effectiveDate)
            : 'Tekur þegar gildi'}
        </Text>
      </OverviewItem>

      <OverviewItem label={f(regulation.summary.labels.lawChapters)}>
        {reg?.lawChapters && reg.lawChapters.length > 0 ? (
          <Inline space={1} flexWrap="wrap">
            {reg.lawChapters.map((c) => (
              <Tag key={c.slug} variant="blue" outlined disabled>
                {lawChapterNameBySlug[c.slug] ?? c.name ?? c.slug}
              </Tag>
            ))}
          </Inline>
        ) : (
          <Text>—</Text>
        )}
      </OverviewItem>

      {ministry && (
        <OverviewItem label="Ráðuneyti">
          <Text>{ministry}</Text>
        </OverviewItem>
      )}

      <OverviewItem label={f(regulation.summary.labels.fastTrack)}>
        <Text>
          {reg?.fastTrack
            ? f(regulation.summary.labels.yes)
            : f(regulation.summary.labels.no)}
        </Text>
      </OverviewItem>

      <OverviewItem label="Áætlað verð">
        {priceLoading ? (
          <Text>...</Text>
        ) : priceError ? (
          <Text>Ekki tókst að sækja verð</Text>
        ) : (
          <Text>{`${formatNumber(price ?? 0)} kr.`}</Text>
        )}
      </OverviewItem>

      {advert?.requestedDate && (
        <OverviewItem label="Ósk um útgáfudag">
          <Text>{formatDate(advert.requestedDate)}</Text>
        </OverviewItem>
      )}

      {advert?.channels && advert.channels.length > 0 && (
        <OverviewItem label="Samskiptaleiðir">
          {advert.channels.map((ch, i) => (
            <Text key={i} variant="small">
              {[ch.name, ch.email, ch.phone].filter(Boolean).join(' — ')}
            </Text>
          ))}
        </OverviewItem>
      )}

      {reg?.impacts && reg.impacts.length > 0 && (
        <>
          <Box paddingBottom={3}>
            <Divider />
          </Box>
          <Text variant="h4" as="h4" marginBottom={2}>
            Áhrif á aðrar reglugerðir
          </Text>

          {Object.entries(
            reg.impacts.reduce<Record<string, RegulationImpactSchema[]>>(
              (acc, impact) => {
                const key = impact.name
                if (!acc[key]) acc[key] = []
                acc[key].push(impact)
                return acc
              },
              {},
            ),
          ).map(([key, impactsList]) => {
            const label =
              key === 'self'
                ? 'Hefur áhrif á sjálfa sig'
                : prettyName(key as RegName)

            return (
              <OverviewItem key={key} label={label}>
                {impactsList.map((impact) => (
                  <Text key={impact.id} variant="small">
                    {impact.date ? formatDate(impact.date) : '—'}
                    {' — '}
                    {impact.type === 'amend'
                      ? 'Textabreyting'
                      : 'Fellur úr gildi'}
                  </Text>
                ))}
              </OverviewItem>
            )
          })}
        </>
      )}
    </Box>
  )
}
