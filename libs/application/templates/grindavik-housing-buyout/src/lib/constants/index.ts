import { MessageDescriptor } from 'react-intl'
import * as m from '../messages'

export const TWENTY_FOUR_HOURS_IN_MS = 24 * 3600 * 1000

export enum States {
  PREREQUISITES = 'prerequisites',
  DRAFT = 'draft',
  IN_REVIEW = 'inReview',
  SENT_TO_THORKATLA = 'sentToThorkatla',
  APPROVED_BY_THORKATLA = 'approvedByThorkatla',
  PURCHASE_AGREEMENT_SENT_FOR_SIGNING = 'purchaseAgreementSentForSigning',
  PURCHASE_AGREEMENT_RECEIVED_FROM_SIGNING = 'purchaseAgreementReceivedFromSigning',
  PURCHASE_AGREEMENT_DECLARED = 'purchaseAgreementDeclared',
  PAID_OUT = 'paidOut',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export const OTHER_PROVIDER = 'OTHER'

export enum PreemptiveRight {
  PURCHASE_RIGHT = 'kauprettur',
  PRE_PURCHASE_RIGHT = 'forkaupsrettur',
  PRE_LEASE_RIGHT = 'forleigurettur',
}

export const preemptiveRightLabels: Record<PreemptiveRight, MessageDescriptor> =
  {
    [PreemptiveRight.PURCHASE_RIGHT]: m.application.overview.purchaseRight,
    [PreemptiveRight.PRE_PURCHASE_RIGHT]:
      m.application.overview.prePurchaseRight,
    [PreemptiveRight.PRE_LEASE_RIGHT]: m.application.overview.preLeaseRight,
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
