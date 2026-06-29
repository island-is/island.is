import { MarriageConditionsAnswers } from '@island.is/application/templates/marriage-conditions/types'

// Value sent to Sýslumenn (vigsluStadur) when the ceremony is held by the
// national church. Unlike office/society there is no list to pick from, so the
// fixed name is sent as a plain string (the religion/office lists carry no codes).
export const NATIONAL_CHURCH_PLACE = 'Þjóðkirkjan'

/**
 * Maps the chosen ceremony place to the string sent to Sýslumenn.
 * - office  -> selected district commissioner office name
 * - society -> selected religious/life-stance organization name
 * - church  -> the national church (fixed name)
 * - otherwise (e.g. "none") -> empty string
 */
export const getCeremonyPlace = (
  ceremony: MarriageConditionsAnswers['ceremony'],
): string => {
  const place = ceremony?.place

  if (place?.ceremonyPlace === 'office' && place?.office) {
    return place.office
  }
  if (place?.ceremonyPlace === 'church') {
    return NATIONAL_CHURCH_PLACE
  }
  if (place?.society) {
    return place.society
  }
  return ''
}
