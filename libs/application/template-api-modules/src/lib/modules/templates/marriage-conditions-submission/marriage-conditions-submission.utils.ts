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

  // Gate each branch on the selected type so a stale office/society value left
  // over from a previous selection is never submitted for another choice.
  switch (place?.ceremonyPlace) {
    case 'office':
      return place.office ?? ''
    case 'society':
      return place.society ?? ''
    case 'church':
      return NATIONAL_CHURCH_PLACE
    default:
      return ''
  }
}
