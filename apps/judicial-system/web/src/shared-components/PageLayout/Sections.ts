import { CaseType } from '@island.is/judicial-system/types'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'

export const getCustodyAndTravelBanProsecutorSection = (
  caseId?: string,
  caseType?: CaseType,
  activeSubSection?: number,
) => {
  return {
    name:
      caseType === CaseType.CUSTODY
        ? 'Krafa um gæsluvarðhald'
        : 'Krafa um farbann',
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

export const getRCaseProsecutorSection = (
  caseId?: string,
  caseType?: CaseType,
  activeSubSection?: number,
) => {
  return {
    name: 'Krafa um rannsóknarheimild',
    children: [
      {
        type: 'SUB_SECTION',
        name: 'Varnaraðili',
        href: `${Constants.NEW_R_CASE_ROUTE}`,
      },
      {
        type: 'SUB_SECTION',
        name: 'Óskir um fyrirtöku',
        href:
          activeSubSection && activeSubSection > 1
            ? `${Constants.R_CASE_HEARING_ARRANGEMENTS_ROUTE}/${caseId}`
            : undefined,
      },
      {
        type: 'SUB_SECTION',
        name: 'Dómkröfur og lagagrundvöllur',
        href:
          activeSubSection && activeSubSection > 2
            ? `${Constants.R_CASE_POLICE_DEMANDS_ROUTE}/${caseId}`
            : undefined,
      },
      {
        type: 'SUB_SECTION',
        name: 'Greinargerð',
        href:
          activeSubSection && activeSubSection > 3
            ? `${Constants.R_CASE_POLICE_REPORT_ROUTE}/${caseId}`
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
