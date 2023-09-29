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
  AllChanges = 'Ný mál og breytingar',
  StatusChanges = 'Breytingar á stöðu',
  OnlyNew = 'Einungis ný mál',
}

export enum SubscriptionTypeKey {
  'Ný mál og breytingar' = 'AllChanges',
  'Breytingar á stöðu' = 'StatusChanges',
  'Einungis ný mál' = 'OnlyNew',
}
export enum SubscriptionDescriptionKey {
  'Ný mál og breytingar' = 'Tilkynningar um ný mál, breyttan umsagnarfrest, umsagnarfrest sem er að renna út og birtingu niðurstaðna',
  'Breytingar á stöðu' = 'StatusChanges',
  'Einungis ný mál' = 'Tilkynningar um ný mál',
}

export const advicePublishTypeKeyHelper = {
  1: 'publishNow',
  2: 'publishAfter',
  3: 'publishNever',
}

export enum CaseStatuses {
  forReview = 'Til umsagnar',
  inProgress = 'Niðurstöður í vinnslu',
  published = 'Niðurstöður birtar',
}

export enum MapCaseStatuses {
  'Til umsagnar' = 'Til umsagnar',
  'Niðurstöður í vinnslu' = 'Í vinnslu',
  'Niðurstöður birtar' = 'Samráði lokið',
}

export enum SubscriptionTypes {
  AllChanges = 'AllChanges',
  StatusChanges = 'StatusChanges',
  OnlyNew = 'OnlyNew',
}

export enum FilterTypes {
  sorting = 'sorting',
  caseStatuses = 'caseStatuses',
  caseTypes = 'caseTypes',
}
