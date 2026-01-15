const CASE_STATUSES = [
  'RECEIVED', // Mál móttekið
  'BACK_TO_INVESTIGATION', // Aftur í rannsókn
  'UNDER_INVESTIGATION', // Í rannsókn
  'CASE_ON_HOLD', // Mál í bið
  'CASE_SENT_TO_OTHER_DEPARTMENT', // Mál sent til annars embættis
  'PROSECUTOR_REVIEW', // Yfirferð ákæranda
  'INVESTIGATION_STOPPED', // Rannsókn hætt
  'CASE_DISMISSED', // Mál fellt niður
  'DECISION_APPEALED', // Ákvörðun kærð
  'DECISION_CONFIRMED', // Ákvörðun staðfest
  'DECISION_OVERTURNED', // Ákvörðun felld úr gildi
  'CASE_CLOSED', // Máli lokið
  'PROSECUTION_DROPPED', // Fallið frá saksókn
  'DISTRICT_PROSECUTOR_REVIEW', // Yfirferð héraðssaksóknara
  'INDICTMENT', // Ákæra
  'COURT_SCHEDULING', // Þingfesting
  'RULING_ANNOUNCED', // Dómur birtur
  'DISTRICT_COURT_PROCEEDINGS', // Málsmeðferð fyrir héraðsdómi
  'CLOSED_BY_DISTRICT_COURT', // Máli lokið með héraðsdómi
  'APPEAL', // Áfrýjun
  'MEDIATION', // Sáttarmiðlun
  'SUPREME_COURT_APPEAL_REQUEST', // Beiðni um áfrýjunarleyfi sent til hæstaréttar
  'UNKNOWN', // Unknown or unrecognized status
] as const

export type CaseStatus = typeof CASE_STATUSES[number]
