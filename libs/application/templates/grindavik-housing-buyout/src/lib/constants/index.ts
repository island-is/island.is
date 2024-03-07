export const TWENTY_FOUR_HOURS_IN_MS = 24 * 3600 * 1000

export enum States {
  PREREQUISITES = 'prerequisites',
  DRAFT = 'draft',
  IN_REVIEW = 'inReview',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export const OTHER_PROVIDER = 'OTHER'

export enum PreemptiveRight {
  PURCHASE_RIGHT = 'kauprettur',
  PRE_PURCHASE_RIGHT = 'forkaupsrettur',
  PRE_LEASE_RIGHT = 'forleigurettur',
}
