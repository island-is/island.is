import { registerEnumType } from '@nestjs/graphql'

export enum PoliceCaseStatusValue {
  RECEIVED = 'RECEIVED', // Mál móttekið
  BACK_TO_INVESTIGATION = 'BACK_TO_INVESTIGATION', // Aftur í rannsókn
  UNDER_INVESTIGATION = 'UNDER_INVESTIGATION', // Í rannsókn
  CASE_ON_HOLD = 'CASE_ON_HOLD', // Mál í bið
  CASE_SENT_TO_OTHER_DEPARTMENT = 'CASE_SENT_TO_OTHER_DEPARTMENT', // Mál sent til annars embættis
  PROSECUTOR_REVIEW = 'PROSECUTOR_REVIEW', // Yfirferð ákæranda
  INVESTIGATION_STOPPED = 'INVESTIGATION_STOPPED', // Rannsókn hætt
  CASE_DISMISSED = 'CASE_DISMISSED', // Mál fellt niður
  DECISION_APPEALED = 'DECISION_APPEALED', // Ákvörðun kærð
  DECISION_CONFIRMED = 'DECISION_CONFIRMED', // Ákvörðun staðfest
  DECISION_OVERTURNED = 'DECISION_OVERTURNED', // Ákvörðun felld úr gildi
  CASE_CLOSED = 'CASE_CLOSED', // Máli lokið
  PROSECUTION_DROPPED = 'PROSECUTION_DROPPED', // Fallið frá saksókn
  DISTRICT_PROSECUTOR_REVIEW = 'DISTRICT_PROSECUTOR_REVIEW', // Yfirferð héraðssaksóknara
  INDICTMENT = 'INDICTMENT', // Ákæra
  COURT_SCHEDULING = 'COURT_SCHEDULING', // Þingfesting
  RULING_ANNOUNCED = 'RULING_ANNOUNCED', // Dómur birtur
  DISTRICT_COURT_PROCEEDINGS = 'DISTRICT_COURT_PROCEEDINGS', // Málsmeðferð fyrir héraðsdómi
  CLOSED_BY_DISTRICT_COURT = 'CLOSED_BY_DISTRICT_COURT', // Máli lokið með héraðsdómi
  APPEAL = 'APPEAL', // Áfrýjun
  MEDIATION = 'MEDIATION', // Sáttarmiðlun
  SUPREME_COURT_APPEAL_REQUEST = 'SUPREME_COURT_APPEAL_REQUEST', // Beiðni um áfrýjunarleyfi sent til hæstaréttar
  UNKNOWN = 'UNKNOWN', // Unknown or unrecognized status
}

export enum PoliceCaseStatusValueGroup {
  POLICE_ANALYSIS = 'POLICE_ANALYSIS', //Greining lögreglu
  CRIMINAL_INVESTIGATION = 'CRIMINAL_INVESTIGATION', //Rannsókn sakamáls
  POST_INVESTIGATION = 'POST_INVESTIGATION', //Að lokinni rannsókn
  INDICTMENT = 'INDICTMENT', //Ákæra
  SENT_TO_COURT = 'SENT_TO_COURT', // Sent til dómstóla
  UNKNOWN = 'UNKNOWN', // Unknown or unrecognized status
}

/* REGISTERS */

registerEnumType(PoliceCaseStatusValue, {
  name: 'LawAndOrderPoliceCaseStatusValue',
})
registerEnumType(PoliceCaseStatusValueGroup, {
  name: 'LawAndOrderPoliceCaseStatusValueGroup',
})
