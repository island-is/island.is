import { useEffect } from 'react'

import {
  ApplicationCard,
  ApplicationStatus,
} from '@island.is/application/types'
import { Features, useFeatureFlag } from '@island.is/react/feature-flags'

/**
 * Maps a legacy application slug to its SDF counterpart and the feature flag
 * that gates the rollout. Only one slug is ever rendered per page, so a single
 * `useFeatureFlag` call (for the current slug's flag) is enough regardless of
 * how many entries this map grows to have.
 */
const SDF_ROLLOUT: Record<string, { sdfSlug: string; flag: Features }> = {
  'endurmat-brunabotamats': {
    sdfSlug: 'endurmat-brunabotamats-sdf',
    flag: Features.fireCompensationAppraisalSdfRollout,
  },
}

// Statuses that mean the user has work in progress on the legacy application.
// We never redirect these users — they must be able to finish where they are.
const IN_PROGRESS_STATUSES: ReadonlyArray<ApplicationStatus> = [
  ApplicationStatus.DRAFT,
  ApplicationStatus.IN_PROGRESS,
]

interface UseSdfRolloutRedirectResult {
  redirecting: boolean
}

export const useSdfRolloutRedirect = (
  slug: string | undefined,
  applicationCards: ApplicationCard[] | undefined,
  cardsLoading: boolean,
): UseSdfRolloutRedirectResult => {
  const target = slug ? SDF_ROLLOUT[slug] : undefined

  const { value: rolloutEnabled, loading: flagLoading } = useFeatureFlag(
    target?.flag ?? Features.fireCompensationAppraisalSdfRollout,
    false,
  )

  const hasInProgress = (applicationCards ?? []).some((card) =>
    IN_PROGRESS_STATUSES.includes(card.status),
  )

  const decided = !!target && !flagLoading && !cardsLoading
  const shouldRedirect = decided && rolloutEnabled && !hasInProgress

  useEffect(() => {
    if (shouldRedirect && target) {
      // `replace` so the back button doesn't return to the legacy slug and
      // immediately bounce the user forward again. Preserve the query string so
      // any initial query parameter the template relies on carries over.
      window.location.replace(
        `/umsoknir/sdf/${target.sdfSlug}${window.location.search}`,
      )
    }
  }, [shouldRedirect, target])

  // Block the legacy UI while the decision is pending or a redirect is underway.
  const redirecting =
    !!target && (flagLoading || cardsLoading || shouldRedirect)

  return { redirecting }
}
