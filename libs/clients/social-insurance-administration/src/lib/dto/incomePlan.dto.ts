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

export const mapIncomePlanDto = (
  data: TrWebCommonsExternalPortalsApiModelsIncomePlanIncomePlanDto,
): IncomePlanDto | undefined => ({
  year: data.year ?? undefined,
  registrationDate: data.registrationDate ?? undefined,
  status: data.status as IncomePlanStatus,
  origin: data.origin ?? undefined,
  incomeTypeLines: data.incomeTypeLines ?? undefined,
})
