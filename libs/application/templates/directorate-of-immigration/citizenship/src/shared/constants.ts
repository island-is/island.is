export enum ApiActions {
  createCharge = 'createCharge',
  getResidenceConditionInfo = 'getResidenceConditionInfo',
  getCountries = 'getCountries',
  getTravelDocumentTypes = 'getTravelDocumentTypes',
  getOldCountryOfResidenceList = 'getOldCountryOfResidenceList',
  getOldStayAbroadList = 'getOldStayAbroadList',
  getOldPassportItem = 'getOldPassportItem',
  getNationalRegistryIndividual = 'getNationalRegistryIndividual',
  getNationalRegistrySpouseDetails = 'getNationalRegistrySpouseDetails',
  submitApplication = 'submitApplication',
  validateApplication = 'validateApplication',
}

export const MAX_CNT_APPLICANTS = 18

export const MIN_AGE_WRITTEN_CONSENT = 12
export const MIN_AGE_CHILD_INFORMATION_BOX = 11
export const MAX_AGE_CHILD_INFORMATION_BOX = 18
export const MIN_AGE_CHILD_WARNING = 17
