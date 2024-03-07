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

export const loanProviders = [
  'Landsbankinn hf.',
  'Íslandsbanki hf.',
  'ÍL-sjóður',
  'Arion banki hf.',
  'Gildi - lífeyrissjóður',
  'Lífeyrissjóður verzlunarmanna',
  'Brú Lífeyrissjóður starfs sveit',
  'Birta lífeyrissjóður',
  'Lífeyrissj.starfsm.rík. (LSR)',
  'Almenni lífeyrissjóðurinn',
  'Festa - lífeyrissjóður',
  'Sparisjóður Austurlands hf.',
  'Lífsverk lífeyrissjóður',
  'Húsnæðissjóður',
  'Eftirlaunasjóður FÍA',
  'Stapi lífeyrissjóður',
  'Söfnunarsjóður lífeyrisréttinda',
  'Frjálsi lífeyrissjóðurinn',
  'Kvika banki hf.',
]
