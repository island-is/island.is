import {
  IncomePlanStatus,
  TrWebContractsExternalDigitalIcelandIncomePlanIncomePlanDto,
  TrWebContractsExternalDigitalIcelandIncomePlanIncomeTypeLine,
} from '../..'

export interface IncomePlanDto {
  year?: number
  registrationDate?: Date
  status?: IncomePlanStatus
  origin?: string
  incomeTypeLines?: Array<TrWebContractsExternalDigitalIcelandIncomePlanIncomeTypeLine>
}

export const mapIncomePlanDto = (
  data: TrWebContractsExternalDigitalIcelandIncomePlanIncomePlanDto,
): IncomePlanDto | undefined => ({
  year: data.year ?? undefined,
  registrationDate: data.registrationDate ?? undefined,
  status: data.status as IncomePlanStatus,
  origin: data.origin ?? undefined,
  incomeTypeLines: data.incomeTypeLines ?? undefined,
})
