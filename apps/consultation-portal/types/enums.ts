export enum Area {
  case = 'Mál',
  institution = 'Stofnanir',
  policyArea = 'Málefnasvið',
}

export enum SortOptions {
  aToZ = 'Stafrófsröð',
  latest = 'Nýjast efst',
  oldest = 'Elst efst',
}

export enum SortOptionsAdvices {
  oldest = 'Elst efst',
  latest = 'Nýjast efst',
}

export enum CaseStatusFilterOptions {
  forReview = 'Til umsagnar',
  resultsInProgress = 'Niðurstöður í vinnslu',
  resultsPublished = 'Niðurstöður birtar',
}

export enum CaseTypesFilterOptions {
  draftBill = 'Drög að frumvarpi til laga',
  draftRegulation = 'Drög að reglugerð',
  draftPolicy = 'Drög að stefnu',
  positionAndOptions = 'Stöðumat og valkostir',
  other = 'Annað',
}

export enum CaseSortOptions {
  lastUpdated = 'Síðast uppfært',
  latestCases = 'Nýjast',
  adviceDeadline = 'Frestur að renna út',
}

export enum CaseSubscriptionType {
  AllChanges = 'Allar breytingar',
  StatusChanges = 'Breytingar á stöðu',
}

export enum SubscriptionType {
  AllChanges = 'Allar breytingar',
  StatusChanges = 'Breytingar á stöðu',
  OnlyNew = 'Einungis ný mál',
}

export enum SubscriptionTypeKey {
  'Allar breytingar' = 'AllChanges',
  'Breytingar á stöðu' = 'StatusChanges',
  'Einungis ný mál' = 'OnlyNew',
}
