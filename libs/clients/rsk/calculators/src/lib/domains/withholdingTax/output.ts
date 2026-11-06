import type { TaxBracket, WithholdingTaxResult } from '../../../../gen/fetch'
import { rskRatioToPercent } from '../../utils/rskRatioToPercent'
import { toNumber } from '../../utils/toNumber'
import type {
  WithholdingTaxBracketOutput,
  WithholdingTaxOutput,
} from './definition'

const toWithholdingTaxBracketOutput = (
  bracket: TaxBracket,
): WithholdingTaxBracketOutput => ({
  lowerBound: toNumber(bracket.nedriMork),
  bracketNumber: toNumber(bracket.numerThreps),
  withholdingRate: rskRatioToPercent(bracket.stadgreidsluhlutfall),
  calculatedWithholding: toNumber(bracket.reiknudStadgreidsla),
})

export const toWithholdingTaxOutput = (
  result: WithholdingTaxResult,
): WithholdingTaxOutput => ({
  monthlySalary: result.manadarlaun ?? undefined,
  appliedPensionFundRatio: rskRatioToPercent(result.lifeyrisjodurProsenta),
  appliedPrivatePensionRatio: rskRatioToPercent(result.sereignProsenta),
  pensionFundPayment: result.lifeyrissjodur ?? undefined,
  privatePensionPayment: result.sereignarsjodur ?? undefined,
  totalDeductions: result.fradratturAlls ?? undefined,
  personalTaxCredit: result.personuafslattur ?? undefined,
  spousePersonalTaxCredit: result.personuafslatturFraMaka ?? undefined,
  taxBase: result.skattstofn ?? undefined,
  calculatedWithholding: result.reiknudStadgreidsla ?? undefined,
  paidWithholding: result.greiddStadgreidsla ?? undefined,
  highIncomeTax: result.hatekjuskattur ?? undefined,
  highIncomeTaxApplied: result.reiknadiHatekjuskatt ?? undefined,
  salaryAfterDeductions: result.utborgudLaun ?? undefined,
  accumulatedPersonalTaxCredit: result.uppsafnadurPersonuafslattur ?? undefined,
  incomeYear: result.tekjuar ?? undefined,
  maritalStatusCode: result.hjuskaparstada ?? undefined,
  payMonth: result.launamanudur ?? undefined,
  childIncomeLimit: result.fritekjumarkBarns ?? undefined,
  childBirthYear: result.faedingararBarns ?? undefined,
  withholdingRate: rskRatioToPercent(result.stadgreidsluhlutfall),
  employerPensionMatch: result.motframlag ?? undefined,
  payrollTaxBase: result.tryggingagjaldsstofn ?? undefined,
  payrollTax: result.tryggingagjald ?? undefined,
  taxBrackets: (Array.isArray(result.skattthrep) ? result.skattthrep : []).map(
    toWithholdingTaxBracketOutput,
  ),
})
