import {
  Case,
  CaseDecision,
  CaseState,
  CaseType,
  isInvestigationCase,
  isRestrictionCase,
} from '@island.is/judicial-system/types'
import {
  getCourtSections,
  getCustodyAndTravelBanProsecutorSection,
  getExtenstionSections,
  getInvestigationCaseCourtSections,
  getInvestigationCaseProsecutorSection,
} from '@island.is/judicial-system-web/src/utils/sections'

interface TranslationStrings {
  dismissedTitle: string
}

export const caseResult = (
  translationStrings: TranslationStrings,
  workingCase?: Case,
) => {
  if (!workingCase) {
    return ''
  }

  const isAccepted =
    workingCase.state === CaseState.ACCEPTED ||
    workingCase?.parentCase?.state === CaseState.ACCEPTED

  /**
   * No need to check the parent case state because you can't extend a
   * travel ban cases, dissmissed or rejected cases
   */
  const isRejected = workingCase?.state === CaseState.REJECTED
  const isDismissed = workingCase.state === CaseState.DISMISSED

  const isAlternativeTravelBan =
    workingCase.state === CaseState.ACCEPTED &&
    workingCase.decision === CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN

  if (isRejected) {
    if (isInvestigationCase(workingCase.type)) {
      return 'Kröfu um rannsóknarheimild hafnað'
    } else {
      return 'Kröfu hafnað'
    }
  } else if (isAccepted) {
    if (isInvestigationCase(workingCase?.type)) {
      return 'Krafa um rannsóknarheimild samþykkt'
    } else {
      return workingCase?.isValidToDateInThePast
        ? `${
            workingCase.type === CaseType.CUSTODY
              ? 'Gæsluvarðhaldi'
              : 'Farbanni'
          } lokið`
        : `${
            workingCase.type === CaseType.CUSTODY ? 'Gæsluvarðhald' : 'Farbann'
          } virkt`
    }
  } else if (isDismissed) {
    return translationStrings.dismissedTitle
  } else if (isAlternativeTravelBan) {
    return workingCase.isValidToDateInThePast
      ? 'Farbanni lokið'
      : 'Farbann virkt'
  } else {
    return 'Niðurstaða'
  }
}

export const getSections = (
  translationStrings: TranslationStrings,
  workingCase?: Case,
  activeSubSection?: number,
) => {
  return [
    isRestrictionCase(workingCase?.type)
      ? getCustodyAndTravelBanProsecutorSection(
          workingCase || ({} as Case),
          activeSubSection,
        )
      : getInvestigationCaseProsecutorSection(
          workingCase || ({} as Case),
          activeSubSection,
        ),
    isRestrictionCase(workingCase?.type)
      ? getCourtSections(workingCase || ({} as Case), activeSubSection)
      : getInvestigationCaseCourtSections(
          workingCase || ({} as Case),
          activeSubSection,
        ),
    {
      name: caseResult(
        { dismissedTitle: translationStrings.dismissedTitle },
        workingCase,
      ),
    },
    getExtenstionSections(workingCase || ({} as Case), activeSubSection),
    getCourtSections(workingCase || ({} as Case), activeSubSection),
  ]
}
