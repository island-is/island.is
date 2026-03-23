import { FormatMessage } from '@island.is/cms-translations'
import { CaseStatus } from '../models/police-cases/caseStatus.model'
import {
  POLICE_CASE_GROUP_TIMELINE_STEP_LOOKUP,
  POLICE_CASE_STATUS_INFO,
} from '../types/constants'
import {
  PoliceCaseStatusValue,
  PoliceCaseStatusValueGroup,
} from '../types/enums'

export const mapPoliceCaseStatusValue = (
  status?: string,
): PoliceCaseStatusValue => {
  if (!status) return PoliceCaseStatusValue.UNKNOWN

  switch (status) {
    case 'Mál móttekið':
      return PoliceCaseStatusValue.RECEIVED
    case 'Aftur í rannsókn':
      return PoliceCaseStatusValue.BACK_TO_INVESTIGATION
    case 'Í rannsókn':
      return PoliceCaseStatusValue.UNDER_INVESTIGATION
    case 'Mál í bið':
      return PoliceCaseStatusValue.CASE_ON_HOLD
    case 'Mál sent til annars embættis':
      return PoliceCaseStatusValue.CASE_SENT_TO_OTHER_DEPARTMENT
    case 'Yfirferð ákæranda':
      return PoliceCaseStatusValue.PROSECUTOR_REVIEW
    case 'Rannsókn hætt':
      return PoliceCaseStatusValue.INVESTIGATION_STOPPED
    case 'Mál fellt niður':
      return PoliceCaseStatusValue.CASE_DISMISSED
    case 'Ákvörðun kærð':
      return PoliceCaseStatusValue.DECISION_APPEALED
    case 'Ákvörðun staðfest':
      return PoliceCaseStatusValue.DECISION_CONFIRMED
    case 'Ákvörðun felld úr gildi':
      return PoliceCaseStatusValue.DECISION_OVERTURNED
    case 'Máli lokið':
      return PoliceCaseStatusValue.CASE_CLOSED
    case 'Fallið frá saksókn':
      return PoliceCaseStatusValue.PROSECUTION_DROPPED
    case 'Yfirferð héraðssaksóknara':
      return PoliceCaseStatusValue.DISTRICT_PROSECUTOR_REVIEW
    case 'Ákæra':
      return PoliceCaseStatusValue.INDICTMENT
    case 'Þingfesting':
      return PoliceCaseStatusValue.COURT_SCHEDULING
    case 'Dómur birtur':
      return PoliceCaseStatusValue.RULING_ANNOUNCED
    case 'Málsmeðferð fyrir héraðsdómi':
      return PoliceCaseStatusValue.DISTRICT_COURT_PROCEEDINGS
    case 'Máli lokið með héraðsdómi':
      return PoliceCaseStatusValue.CLOSED_BY_DISTRICT_COURT
    case 'Áfrýjun':
      return PoliceCaseStatusValue.APPEAL
    case 'Sáttarmiðlun':
      return PoliceCaseStatusValue.MEDIATION
    case 'Beiðni um áfrýjunarleyfi sent til hæstaréttar':
      return PoliceCaseStatusValue.SUPREME_COURT_APPEAL_REQUEST
    default:
      return PoliceCaseStatusValue.UNKNOWN
  }
}

export const mapPoliceCaseStatus = (
  statusValue: PoliceCaseStatusValue,
  formatMessage: FormatMessage,
  rawStatus?: string,
): CaseStatus => {
  if (statusValue === PoliceCaseStatusValue.UNKNOWN) {
    return {
      value: statusValue,
      statusGroup: PoliceCaseStatusValueGroup.UNKNOWN,
    }
  }

  const { header, description, group } = POLICE_CASE_STATUS_INFO[statusValue]

  return {
    value: statusValue,
    statusGroup: group,
    timelineStep: POLICE_CASE_GROUP_TIMELINE_STEP_LOOKUP[group],
    headerDisplayString:
      rawStatus ?? (header ? formatMessage(header) : undefined),
    descriptionDisplayString: description
      ? formatMessage(description)
      : undefined,
  }
}
