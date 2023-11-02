import {
  GetChargeItemSubjectsByYearQuery,
  GetChargeTypePeriodSubjectQuery,
  GetChargeTypesByYearQuery,
  GetChargeTypesDetailsByYearQuery,
} from '../../screens/FinanceTransactionPeriods/FinanceTransactionPeriods.generated'

export type ChargeItemSubjects =
  GetChargeItemSubjectsByYearQuery['getChargeItemSubjectsByYear']['chargeItemSubjects']

export type ChargeItemSubject =
  GetChargeItemSubjectsByYearQuery['getChargeItemSubjectsByYear']['chargeItemSubjects'][0]

export type ChargeItemSubjectsPeriod = ChargeItemSubject['periods'][0]

export type ChargeTypesDetailsByYear =
  GetChargeTypesDetailsByYearQuery['getChargeTypesDetailsByYear']

export type ChargeTypes = ChargeTypesDetailsByYear['chargeType']

export type ChargeTypesByYear =
  GetChargeTypesByYearQuery['getChargeTypesByYear']

export type ChargeTypePeriodSubjects =
  GetChargeTypePeriodSubjectQuery['getChargeTypePeriodSubject']['records']

export type SelectedPeriod = {
  year: string
  typeId: string
  period: string
  subject: string
}
