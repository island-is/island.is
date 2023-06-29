export enum ApiActions {
  createCharge = 'createCharge',
  getResidenceConditions = 'getResidenceConditions',
  getCountries = 'getCountries',
  getTravelDocumentTypes = 'getTravelDocumentTypes',
  getOldCountryOfResidenceList = 'getOldCountryOfResidenceList',
  getOldStayAbroadList = 'getOldStayAbroadList',
  getOldPassportItem = 'getOldPassportItem',
  getOldForeignCriminalRecordFileList = 'getOldForeignCriminalRecordFileList',
  getNationalRegistryIndividual = 'getNationalRegistryIndividual',
  getNationalRegistrySpouseDetails = 'getNationalRegistrySpouseDetails',
  submitApplication = 'submitApplication',
  initReview = 'initReview',
  addReview = 'addReview',
  validateApplication = 'validateApplication',
}

export const MAX_CNT_APPLICANTS = 10
