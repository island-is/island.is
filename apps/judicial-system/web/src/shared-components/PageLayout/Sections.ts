import { Case, CaseState, CaseType } from '@island.is/judicial-system/types'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import {
  isAccusedStepValidRC,
  isDefendantStepValidIC,
  isHearingArrangementsStepValidIC,
  isHearingArrangementsStepValidRC,
  isPoliceDemandsStepValidIC,
  isPoliceDemandsStepValidRC,
  isPoliceReportStepValidRC,
} from '../../utils/validate'

export const getCustodyAndTravelBanProsecutorSection = (
  workingCase: Case,
  activeSubSection?: number,
) => {
  const { type, id, state } = workingCase

  return {
    name:
      type === CaseType.CUSTODY ? 'Krafa um gæsluvarðhald' : 'Krafa um farbann',
    children: [
      {
        type: 'SUB_SECTION',
        name: 'Sakborningur',
        href: `${Constants.STEP_ONE_ROUTE}/${id}`,
      },
      {
        type: 'SUB_SECTION',
        name: 'Óskir um fyrirtöku',
        href:
          (activeSubSection && activeSubSection > 1) ||
          (state === CaseState.SUBMITTED && isAccusedStepValidRC(workingCase))
            ? `${Constants.STEP_TWO_ROUTE}/${id}`
            : undefined,
      },
      {
        type: 'SUB_SECTION',
        name: 'Dómkröfur og lagagrundvöllur',
        href:
          (activeSubSection && activeSubSection > 2) ||
          (state === CaseState.SUBMITTED &&
            isAccusedStepValidRC(workingCase) &&
            isHearingArrangementsStepValidRC(workingCase))
            ? `${Constants.STEP_THREE_ROUTE}/${id}`
            : undefined,
      },
      {
        type: 'SUB_SECTION',
        name: 'Greinargerð',
        href:
          (activeSubSection && activeSubSection > 3) ||
          (state === CaseState.SUBMITTED &&
            isAccusedStepValidRC(workingCase) &&
            isHearingArrangementsStepValidRC(workingCase) &&
            isPoliceDemandsStepValidRC(workingCase))
            ? `${Constants.STEP_FOUR_ROUTE}/${id}`
            : undefined,
      },
      {
        type: 'SUB_SECTION',
        name: 'Rannsóknargögn',
        href:
          (activeSubSection && activeSubSection > 4) ||
          (state === CaseState.SUBMITTED &&
            isAccusedStepValidRC(workingCase) &&
            isHearingArrangementsStepValidRC(workingCase) &&
            isPoliceDemandsStepValidRC(workingCase) &&
            isPoliceReportStepValidRC(workingCase))
            ? `${Constants.STEP_FIVE_ROUTE}/${id}`
            : undefined,
      },
      {
        type: 'SUB_SECTION',
        name: 'Yfirlit kröfu',
        href:
          state === CaseState.SUBMITTED &&
          isAccusedStepValidRC(workingCase) &&
          isHearingArrangementsStepValidRC(workingCase) &&
          isPoliceDemandsStepValidRC(workingCase) &&
          isPoliceReportStepValidRC(workingCase)
            ? `${Constants.STEP_SIX_ROUTE}/${id}`
            : undefined,
      },
    ],
  }
}

export const getInvestigationCaseProsecutorSection = (
  workingCase: Case,
  activeSubSection?: number,
) => {
  const { id, state } = workingCase

  return {
    name: 'Krafa um rannsóknarheimild',
    children: [
      {
        type: 'SUB_SECTION',
        name: 'Varnaraðili',
        href: `${Constants.IC_DEFENDANT_ROUTE}/${id}`,
      },
      {
        type: 'SUB_SECTION',
        name: 'Óskir um fyrirtöku',
        href:
          (activeSubSection && activeSubSection > 1) ||
          (state === CaseState.SUBMITTED && isDefendantStepValidIC(workingCase))
            ? `${Constants.IC_HEARING_ARRANGEMENTS_ROUTE}/${id}`
            : undefined,
      },
      {
        type: 'SUB_SECTION',
        name: 'Dómkröfur og lagagrundvöllur',
        href:
          (activeSubSection && activeSubSection > 2) ||
          (state === CaseState.SUBMITTED &&
            isDefendantStepValidIC(workingCase) &&
            isHearingArrangementsStepValidIC(workingCase))
            ? `${Constants.IC_POLICE_DEMANDS_ROUTE}/${id}`
            : undefined,
      },
      {
        type: 'SUB_SECTION',
        name: 'Greinargerð',
        href:
          (activeSubSection && activeSubSection > 3) ||
          (state === CaseState.SUBMITTED &&
            isDefendantStepValidIC(workingCase) &&
            isHearingArrangementsStepValidIC(workingCase) &&
            isPoliceDemandsStepValidIC(workingCase))
            ? `${Constants.IC_POLICE_REPORT_ROUTE}/${id}`
            : undefined,
      },
      {
        type: 'SUB_SECTION',
        name: 'Rannsóknargögn',
        href:
          (activeSubSection && activeSubSection > 4) ||
          (state === CaseState.SUBMITTED &&
            isDefendantStepValidIC(workingCase) &&
            isHearingArrangementsStepValidIC(workingCase) &&
            isPoliceDemandsStepValidIC(workingCase))
            ? `${Constants.IC_CASE_FILES_ROUTE}/${id}`
            : undefined,
      },
      {
        type: 'SUB_SECTION',
        name: 'Yfirlit kröfu',
        href:
          state === CaseState.SUBMITTED &&
          isDefendantStepValidIC(workingCase) &&
          isHearingArrangementsStepValidIC(workingCase) &&
          isPoliceDemandsStepValidIC(workingCase)
            ? `${Constants.IC_POLICE_CONFIRMATION_ROUTE}/${id}`
            : undefined,
      },
    ],
  }
}

export const getInvestigationCaseCourtSections = (
  caseId?: string,
  activeSubSection?: number,
) => {
  return {
    name: 'Úrskurður Héraðsdóms',
    children: [
      {
        type: 'SUB_SECTION',
        name: 'Yfirlit kröfu',
        href: `${Constants.IC_OVERVIEW_ROUTE}/${caseId}`,
      },
      {
        type: 'SUB_SECTION',
        name: 'Fyrirtökutími',
        href:
          activeSubSection && activeSubSection > 1
            ? `${Constants.IC_COURT_HEARING_ARRANGEMENTS_ROUTE}/${caseId}`
            : undefined,
      },
      {
        type: 'SUB_SECTION',
        name: 'Þingbók',
        href:
          activeSubSection && activeSubSection > 2
            ? `${Constants.IC_COURT_RECORD_ROUTE}/${caseId}`
            : undefined,
      },
      {
        type: 'SUB_SECTION',
        name: 'Úrskurður',
        href:
          activeSubSection && activeSubSection > 3
            ? `${Constants.IC_RULING_STEP_ONE_ROUTE}/${caseId}`
            : undefined,
      },
      {
        type: 'SUB_SECTION',
        name: 'Úrskurðarorð',
        href:
          activeSubSection && activeSubSection > 4
            ? `${Constants.IC_RULING_STEP_TWO_ROUTE}/${caseId}`
            : undefined,
      },
      { type: 'SUB_SECTION', name: 'Yfirlit úrskurðar' },
    ],
  }
}

export const getCourtSections = (
  caseId?: string,
  activeSubSection?: number,
) => {
  return {
    name: 'Úrskurður Héraðsdóms',
    children: [
      {
        type: 'SUB_SECTION',
        name: 'Yfirlit kröfu',
        href: `${Constants.COURT_SINGLE_REQUEST_BASE_ROUTE}/${caseId}`,
      },
      {
        type: 'SUB_SECTION',
        name: 'Fyrirtökutími',
        href:
          activeSubSection && activeSubSection > 1
            ? `${Constants.HEARING_ARRANGEMENTS_ROUTE}/${caseId}`
            : undefined,
      },
      {
        type: 'SUB_SECTION',
        name: 'Þingbók',
        href:
          activeSubSection && activeSubSection > 2
            ? `${Constants.COURT_RECORD_ROUTE}/${caseId}`
            : undefined,
      },
      {
        type: 'SUB_SECTION',
        name: 'Úrskurður',
        href:
          activeSubSection && activeSubSection > 3
            ? `${Constants.RULING_STEP_ONE_ROUTE}/${caseId}`
            : undefined,
      },
      {
        type: 'SUB_SECTION',
        name: 'Úrskurðarorð',
        href:
          activeSubSection && activeSubSection > 4
            ? `${Constants.RULING_STEP_TWO_ROUTE}/${caseId}`
            : undefined,
      },
      { type: 'SUB_SECTION', name: 'Yfirlit úrskurðar' },
    ],
  }
}

export const getExtenstionSections = (
  caseId?: string,
  activeSubSection?: number,
) => {
  return {
    name: 'Krafa um framlengingu',
    children: [
      {
        type: 'SUB_SECTION',
        name: 'Sakborningur',
        href: `${Constants.STEP_ONE_ROUTE}/${caseId}`,
      },
      {
        type: 'SUB_SECTION',
        name: 'Óskir um fyrirtöku',
        href:
          activeSubSection && activeSubSection > 1
            ? `${Constants.STEP_TWO_ROUTE}/${caseId}`
            : undefined,
      },
      {
        type: 'SUB_SECTION',
        name: 'Dómkröfur og lagagrundvöllur',
        href:
          activeSubSection && activeSubSection > 2
            ? `${Constants.STEP_THREE_ROUTE}/${caseId}`
            : undefined,
      },
      {
        type: 'SUB_SECTION',
        name: 'Greinargerð',
        href:
          activeSubSection && activeSubSection > 3
            ? `${Constants.STEP_FOUR_ROUTE}/${caseId}`
            : undefined,
      },
      {
        type: 'SUB_SECTION',
        name: 'Rannsóknargögn',
        href:
          activeSubSection && activeSubSection > 4
            ? `${Constants.STEP_FIVE_ROUTE}/${caseId}`
            : undefined,
      },
      {
        type: 'SUB_SECTION',
        name: 'Yfirlit kröfu',
      },
    ],
  }
}
