import { PoliceCaseStatus } from '../types/enums';

export const mapPoliceCaseStatus = (status?: string): PoliceCaseStatus => {
  if (!status) return PoliceCaseStatus.UNKNOWN;

  switch (status) {
    case 'Mál móttekið':
      return PoliceCaseStatus.RECEIVED;
    case 'Aftur í rannsókn':
      return PoliceCaseStatus.BACK_TO_INVESTIGATION;
    case 'Í rannsókn':
      return PoliceCaseStatus.UNDER_INVESTIGATION;
    case 'Mál í bið':
      return PoliceCaseStatus.CASE_ON_HOLD;
    case 'Mál sent til annars embættis':
      return PoliceCaseStatus.CASE_SENT_TO_OTHER_DEPARTMENT;
    case 'Yfirferð ákæranda':
      return PoliceCaseStatus.PROSECUTOR_REVIEW;
    case 'Rannsókn hætt':
      return PoliceCaseStatus.INVESTIGATION_STOPPED;
    case 'Mál fellt niður':
      return PoliceCaseStatus.CASE_DISMISSED;
    case 'Ákvörðun kærð':
      return PoliceCaseStatus.DECISION_APPEALED;
    case 'Ákvörðun staðfest':
      return PoliceCaseStatus.DECISION_CONFIRMED;
    case 'Ákvörðun felld úr gildi':
      return PoliceCaseStatus.DECISION_OVERTURNED;
    case 'Máli lokið':
      return PoliceCaseStatus.CASE_CLOSED;
    case 'Fallið frá saksókn':
      return PoliceCaseStatus.PROSECUTION_DROPPED;
    case 'Yfirferð héraðssaksóknara':
      return PoliceCaseStatus.DISTRICT_PROSECUTOR_REVIEW;
    case 'Ákæra':
      return PoliceCaseStatus.INDICTMENT;
    case 'Þingfesting':
      return PoliceCaseStatus.COURT_SCHEDULING;
    case 'Dómur birtur':
      return PoliceCaseStatus.RULING_ANNOUNCED;
    case 'Málsmeðferð fyrir héraðsdómi':
      return PoliceCaseStatus.DISTRICT_COURT_PROCEEDINGS;
    case 'Máli lokið með héraðsdómi':
      return PoliceCaseStatus.CLOSED_BY_DISTRICT_COURT;
    case 'Áfrýjun':
      return PoliceCaseStatus.APPEAL;
    case 'Sáttarmiðlun':
      return PoliceCaseStatus.MEDIATION;
    case 'Beiðni um áfrýjunarleyfi sent til hæstaréttar':
      return PoliceCaseStatus.SUPREME_COURT_APPEAL_REQUEST;
    default:
      return PoliceCaseStatus.UNKNOWN;
  }
};
