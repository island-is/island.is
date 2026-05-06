import type { ScreenIntrospection } from '../types/translationWorkspace'
import { PREVIEW_EXCLUDED_FIELD_TYPES } from './translationWorkspaceFieldConstants'

/**
 * Applicant info uses either separate postal + city fields or a combined field
 * plus hidden mirrors (`applicantInformationArray`). Introspection lists both
 * variants; the live form only shows one set.
 */
const APPLICANT_POSTAL_ID = 'applicant.postalCode'
const APPLICANT_CITY_ID = 'applicant.city'
const APPLICANT_POSTAL_AND_CITY_ID = 'applicant.postalCodeAndCity'

/** Shown in the real form only when `emailAndPhoneReadOnly` is true. */
const APPLICANT_EMAIL_PHONE_READONLY_ALERT_ID =
  'applicationInfoEmailPhoneAlertMessage'

export const filterPreviewMultiFieldChildren = (
  children: ScreenIntrospection[] | null | undefined,
): ScreenIntrospection[] => {
  if (!children?.length) {
    return []
  }

  const withoutHidden = children.filter(
    (c) => !PREVIEW_EXCLUDED_FIELD_TYPES.has(c.type),
  )

  const hasSeparatePostalAndCity =
    withoutHidden.some((c) => c.id === APPLICANT_POSTAL_ID) &&
    withoutHidden.some((c) => c.id === APPLICANT_CITY_ID)

  const withoutRedundantCombined = hasSeparatePostalAndCity
    ? withoutHidden.filter((c) => c.id !== APPLICANT_POSTAL_AND_CITY_ID)
    : withoutHidden

  return withoutRedundantCombined.filter(
    (c) =>
      !(
        c.type === 'ALERT_MESSAGE' &&
        c.id === APPLICANT_EMAIL_PHONE_READONLY_ALERT_ID
      ),
  )
}
