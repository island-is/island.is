export enum ApiActions {
  createCharge = 'createCharge',
  getCountries = 'getCountries',
  getTravelDocumentTypes = 'getTravelDocumentTypes',
  getApplicantCurrentResidencePermit = 'getApplicantCurrentResidencePermit',
  getChildrenCurrentResidencePermit = 'getChildrenCurrentResidencePermit',
  getApplicantCurrentResidencePermitType = 'getApplicantCurrentResidencePermitType',
  getOldStayAbroadList = 'getOldStayAbroadList',
  getOldCriminalRecordList = 'getOldCriminalRecordList',
  getOldStudyItem = 'getOldStudyItem',
  getOldPassportItem = 'getOldPassportItem',
  getOldAgentItem = 'getOldAgentItem',
  submitApplication = 'submitApplication',
}

export const MAX_CNT_APPLICANTS = 10
