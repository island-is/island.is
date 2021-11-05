import { Case, CaseType } from '@island.is/judicial-system/types'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import {
  isAccusedStepValidRC,
  isCourtHearingArrangemenstStepValidRC,
  isCourtHearingArrangementsStepValidIC,
  isCourtRecordStepValidIC,
  isCourtRecordStepValidRC,
  isDefendantStepValidIC,
  isHearingArrangementsStepValidIC,
  isHearingArrangementsStepValidRC,
  isOverviewStepValidIC,
  isOverviewStepValidRC,
  isPoliceDemandsStepValidIC,
  isPoliceDemandsStepValidRC,
  isPoliceReportStepValidRC,
  isRulingStepOneValidIC,
  isRulingStepOneValidRC,
  isRulingStepTwoValidIC,
  isRulingStepTwoValidRC,
} from '../../utils/validate'

export const getCustodyAndTravelBanProsecutorSection = (
  workingCase: Case,
  activeSubSection?: number,
) => {
  const { type, id } = workingCase

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
          isAccusedStepValidRC(workingCase)
            ? `${Constants.STEP_TWO_ROUTE}/${id}`
            : undefined,
      },
      {
        type: 'SUB_SECTION',
        name: 'Dómkröfur og lagagrundvöllur',
        href:
          (activeSubSection && activeSubSection > 2) ||
          (isAccusedStepValidRC(workingCase) &&
            isHearingArrangementsStepValidRC(workingCase))
            ? `${Constants.STEP_THREE_ROUTE}/${id}`
            : undefined,
      },
      {
        type: 'SUB_SECTION',
        name: 'Greinargerð',
        href:
          (activeSubSection && activeSubSection > 3) ||
          (isAccusedStepValidRC(workingCase) &&
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
          (isAccusedStepValidRC(workingCase) &&
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
  const { id } = workingCase

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
          isDefendantStepValidIC(workingCase)
            ? `${Constants.IC_HEARING_ARRANGEMENTS_ROUTE}/${id}`
            : undefined,
      },
      {
        type: 'SUB_SECTION',
        name: 'Dómkröfur og lagagrundvöllur',
        href:
          (activeSubSection && activeSubSection > 2) ||
          (isDefendantStepValidIC(workingCase) &&
            isHearingArrangementsStepValidIC(workingCase))
            ? `${Constants.IC_POLICE_DEMANDS_ROUTE}/${id}`
            : undefined,
      },
      {
        type: 'SUB_SECTION',
        name: 'Greinargerð',
        href:
          (activeSubSection && activeSubSection > 3) ||
          (isDefendantStepValidIC(workingCase) &&
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
          (isDefendantStepValidIC(workingCase) &&
            isHearingArrangementsStepValidIC(workingCase) &&
            isPoliceDemandsStepValidIC(workingCase))
            ? `${Constants.IC_CASE_FILES_ROUTE}/${id}`
            : undefined,
      },
      {
        type: 'SUB_SECTION',
        name: 'Yfirlit kröfu',
        href:
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
  workingCase: Case,
  activeSubSection?: number,
) => {
  const { id } = workingCase

  return {
    name: 'Úrskurður Héraðsdóms',
    children: [
      {
        type: 'SUB_SECTION',
        name: 'Yfirlit kröfu',
        href: `${Constants.IC_OVERVIEW_ROUTE}/${id}`,
      },
      {
        type: 'SUB_SECTION',
        name: 'Fyrirtökutími',
        href:
          (activeSubSection && activeSubSection > 1) ||
          isOverviewStepValidIC(workingCase)
            ? `${Constants.IC_COURT_HEARING_ARRANGEMENTS_ROUTE}/${id}`
            : undefined,
      },
      {
        type: 'SUB_SECTION',
        name: 'Þingbók',
        href:
          (activeSubSection && activeSubSection > 2) ||
          (isOverviewStepValidIC(workingCase) &&
            isCourtHearingArrangementsStepValidIC(workingCase))
            ? `${Constants.IC_COURT_RECORD_ROUTE}/${id}`
            : undefined,
      },
      {
        type: 'SUB_SECTION',
        name: 'Úrskurður',
        href:
          (activeSubSection && activeSubSection > 3) ||
          (isOverviewStepValidIC(workingCase) &&
            isCourtHearingArrangementsStepValidIC(workingCase) &&
            isCourtRecordStepValidIC(workingCase))
            ? `${Constants.IC_RULING_STEP_ONE_ROUTE}/${id}`
            : undefined,
      },
      {
        type: 'SUB_SECTION',
        name: 'Úrskurðarorð',
        href:
          (activeSubSection && activeSubSection > 4) ||
          (isOverviewStepValidIC(workingCase) &&
            isCourtHearingArrangementsStepValidIC(workingCase) &&
            isCourtRecordStepValidIC(workingCase) &&
            isRulingStepOneValidIC(workingCase))
            ? `${Constants.IC_RULING_STEP_TWO_ROUTE}/${id}`
            : undefined,
      },
      {
        type: 'SUB_SECTION',
        name: 'Yfirlit úrskurðar',
        href:
          isOverviewStepValidIC(workingCase) &&
          isCourtHearingArrangementsStepValidIC(workingCase) &&
          isCourtRecordStepValidIC(workingCase) &&
          isRulingStepOneValidIC(workingCase) &&
          isRulingStepTwoValidIC(workingCase)
            ? `${Constants.IC_CONFIRMATION_ROUTE}/${id}`
            : undefined,
      },
    ],
  }
}

export const getCourtSections = (
  workingCase: Case,
  activeSubSection?: number,
) => {
  const { id } = workingCase

  return {
    name: 'Úrskurður Héraðsdóms',
    children: [
      {
        type: 'SUB_SECTION',
        name: 'Yfirlit kröfu',
        href: `${Constants.COURT_SINGLE_REQUEST_BASE_ROUTE}/${id}`,
      },
      {
        type: 'SUB_SECTION',
        name: 'Fyrirtökutími',
        href:
          (activeSubSection && activeSubSection > 1) ||
          isOverviewStepValidRC(workingCase)
            ? `${Constants.HEARING_ARRANGEMENTS_ROUTE}/${id}`
            : undefined,
      },
      {
        type: 'SUB_SECTION',
        name: 'Þingbók',
        href:
          (activeSubSection && activeSubSection > 2) ||
          (isOverviewStepValidRC(workingCase) &&
            isCourtHearingArrangemenstStepValidRC(workingCase))
            ? `${Constants.COURT_RECORD_ROUTE}/${id}`
            : undefined,
      },
      {
        type: 'SUB_SECTION',
        name: 'Úrskurður',
        href:
          (activeSubSection && activeSubSection > 3) ||
          (isOverviewStepValidRC(workingCase) &&
            isCourtHearingArrangemenstStepValidRC(workingCase) &&
            isCourtRecordStepValidRC(workingCase))
            ? `${Constants.RULING_STEP_ONE_ROUTE}/${id}`
            : undefined,
      },
      {
        type: 'SUB_SECTION',
        name: 'Úrskurðarorð',
        href:
          (activeSubSection && activeSubSection > 4) ||
          (isOverviewStepValidRC(workingCase) &&
            isCourtHearingArrangemenstStepValidRC(workingCase) &&
            isCourtRecordStepValidRC(workingCase) &&
            isRulingStepOneValidRC(workingCase))
            ? `${Constants.RULING_STEP_TWO_ROUTE}/${id}`
            : undefined,
      },
      {
        type: 'SUB_SECTION',
        name: 'Yfirlit úrskurðar',
        href:
          isOverviewStepValidRC(workingCase) &&
          isCourtHearingArrangemenstStepValidRC(workingCase) &&
          isCourtRecordStepValidRC(workingCase) &&
          isRulingStepOneValidRC(workingCase) &&
          isRulingStepTwoValidRC(workingCase)
            ? `${Constants.CONFIRMATION_ROUTE}/${id}`
            : undefined,
      },
    ],
  }
}

export const getExtenstionSections = (
  workingCase: Case,
  activeSubSection?: number,
) => {
  const { id } = workingCase

  return {
    name: 'Krafa um framlengingu',
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
          isAccusedStepValidRC(workingCase)
            ? `${Constants.STEP_TWO_ROUTE}/${id}`
            : undefined,
      },
      {
        type: 'SUB_SECTION',
        name: 'Dómkröfur og lagagrundvöllur',
        href:
          (activeSubSection && activeSubSection > 2) ||
          (isAccusedStepValidRC(workingCase) &&
            isHearingArrangementsStepValidRC(workingCase))
            ? `${Constants.STEP_THREE_ROUTE}/${id}`
            : undefined,
      },
      {
        type: 'SUB_SECTION',
        name: 'Greinargerð',
        href:
          (activeSubSection && activeSubSection > 3) ||
          (isAccusedStepValidRC(workingCase) &&
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
          (isAccusedStepValidRC(workingCase) &&
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
