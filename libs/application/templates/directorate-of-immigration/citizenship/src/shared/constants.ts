export enum ApiActions {
  createCharge = 'createCharge',
  getResidenceConditionInfo = 'getResidenceConditionInfo',
  getCountries = 'getCountries',
  getTravelDocumentTypes = 'getTravelDocumentTypes',
  getCurrentCountryOfResidenceList = 'getCurrentCountryOfResidenceList',
  getCurrentStayAbroadList = 'getCurrentStayAbroadList',
  getCurrentPassportItem = 'getCurrentPassportItem',
  getNationalRegistryIndividual = 'getNationalRegistryIndividual',
  getNationalRegistrySpouseDetails = 'getNationalRegistrySpouseDetails',
  submitApplication = 'submitApplication',
  validateApplication = 'validateApplication',
  getBirthplace = 'getBirthplace',
}

export const MAX_CNT_APPLICANTS = 18

export const MIN_AGE_WRITTEN_CONSENT = 12
export const MIN_AGE_CHILD_INFORMATION_BOX = 11
export const MAX_AGE_CHILD_INFORMATION_BOX = 18
export const MIN_AGE_CHILD_WARNING = 17
