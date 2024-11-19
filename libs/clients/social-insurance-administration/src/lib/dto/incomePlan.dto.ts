import {
  IncomePlanStatus,
  TrWebCommonsExternalPortalsApiModelsIncomePlanIncomePlanDto,
  TrWebCommonsExternalPortalsApiModelsIncomePlanIncomeTypeLine,
} from '../..'

export interface IncomePlanDto {
  year?: number
  registrationDate?: Date
  status?: IncomePlanStatus
  origin?: string
  incomeTypeLines?: Array<TrWebCommonsExternalPortalsApiModelsIncomePlanIncomeTypeLine>
}

/*
export const mapIncomePlanDto = (
  data: TrWebCommonsExternalPortalsApiModelsIncomePlanIncomePlanDto,
): IncomePlanDto | undefined => ({
  year: data.year ?? undefined,
  registrationDate: data.registrationDate ?? undefined,
  status: data.status as IncomePlanStatus,
  origin: data.origin ?? undefined,
  incomeTypeLines: data.incomeTypeLines ?? undefined,
}) */

export const mapIncomePlanDto = (
  data: TrWebCommonsExternalPortalsApiModelsIncomePlanIncomePlanDto,
): IncomePlanDto | undefined => ({
  year: 1993,
  registrationDate: new Date(),
  status: 'InProgress',
  origin: 'islandis',
  incomeTypeLines: [
    {
      incomeCategoryNumber: 1,
      incomeCategoryName: 'ben',
      incomeCategoryCode: '8',
      incomeTypeNumber: 1,
      incomeTypeName: 'bong',
      incomeTypeCode: '8',
      amountJan: 1,
      amountFeb: 2,
      amountMar: 3,
      amountApr: 4,
      amountMay: 5,
      amountJun: 6,
      amountJul: 7,
      amountAug: 8,
      amountSep: 9,
      amountNov: 11,
      amountDec: 12,
      amountOct: 10,
      totalSum: 78,
      currency: 'ISK',
    },
  ],
})
