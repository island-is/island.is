import { ForbiddenException } from '@nestjs/common'

import { Feature } from '@island.is/judicial-system/types'

import { FeatureService } from '../feature/feature.service'

// The lawyers of the appeal proceeding, as the update inputs name them. A
// defendant and a civil claimant are updated through routes that carry plenty
// of other fields, so the feature is decided by what an update touches rather
// than by which route it arrived on.
const appealAdvocateFields = [
  'appealDefenderNationalId',
  'appealDefenderName',
  'appealDefenderEmail',
  'appealDefenderPhoneNumber',
  'appealDefenderWaived',
  'isAppealDefenderConfirmed',
  'hasAppealSpokesperson',
  'appealSpokespersonIsLawyer',
  'appealSpokespersonNationalId',
  'appealSpokespersonName',
  'appealSpokespersonEmail',
  'appealSpokespersonPhoneNumber',
  'isAppealSpokespersonConfirmed',
] as const

// Only the appeal fields are named, so an update of either kind satisfies it -
// and so does the rest of an update once the route's own ids are destructured
// away, which is how both resolvers hand it over.
export type AppealAdvocateUpdate = Partial<
  Record<typeof appealAdvocateFields[number], unknown>
>

/**
 * Refuses an update that touches the appeal proceeding's lawyers while the
 * feature is hidden.
 *
 * The flag hides these actions in the web; closing the write path here too
 * means a hidden feature cannot be reached by calling the API directly, the
 * same way the appeal case resolver closes its own. The backend never reads
 * the feature, so this layer is the only place that can.
 *
 * A field explicitly set to null counts as touched - clearing a defender is as
 * much a change as naming one.
 */
export const assertAppealAdvocatesAvailable = (
  featureService: FeatureService,
  update: AppealAdvocateUpdate,
): void => {
  const touched = appealAdvocateFields.some(
    (field) => update[field] !== undefined,
  )

  if (touched && featureService.isHidden(Feature.INDICTMENT_APPEAL)) {
    throw new ForbiddenException('Indictment appeals are not available')
  }
}
