export enum LegalGazetteStates {
  PREREQUISITES = 'prerequisites',
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum LegalGazetteAPIActions {
  getUserLegalEntities = 'getUserLegalEntities',
  getUserRecentlySelectedAdvertTypes = 'getUserRecentlySelectedAdvertTypes',
  getAdvertTypes = 'getAdvertTypes',
}
