import type { WithholdingTaxResult } from '../../../../gen/fetch'
import { toWithholdingTaxOutput } from './output'

const result: WithholdingTaxResult = {
  manadarlaun: 1,
  lifeyrisjodurProsenta: 0.02,
  sereignProsenta: 0.03,
  lifeyrissjodur: 4,
  sereignarsjodur: 5,
  fradratturAlls: 6,
  personuafslattur: 7,
  personuafslatturFraMaka: 8,
  skattstofn: 9,
  reiknudStadgreidsla: 10,
  greiddStadgreidsla: 11,
  hatekjuskattur: 12,
  reiknadiHatekjuskatt: true,
  utborgudLaun: 14,
  uppsafnadurPersonuafslattur: 15,
  tekjuar: 16,
  hjuskaparstada: 17,
  launamanudur: 18,
  fritekjumarkBarns: 19,
  faedingararBarns: 20,
  stadgreidsluhlutfall: 0.21,
  motframlag: 22,
  tryggingagjaldsstofn: 23,
  tryggingagjald: 24,
  skattthrep: [
    {
      nedriMork: BigInt(100),
      numerThreps: BigInt(200),
      stadgreidsluhlutfall: 0.3,
      reiknudStadgreidsla: BigInt(400),
    },
  ],
}

describe('toWithholdingTaxOutput', () => {
  it('reads each output field from its own RSK source key', () => {
    expect(toWithholdingTaxOutput(result)).toEqual({
      monthlySalary: 1,
      appliedPensionFundRatio: 2,
      appliedPrivatePensionRatio: 3,
      pensionFundPayment: 4,
      privatePensionPayment: 5,
      totalDeductions: 6,
      personalTaxCredit: 7,
      spousePersonalTaxCredit: 8,
      taxBase: 9,
      calculatedWithholding: 10,
      paidWithholding: 11,
      highIncomeTax: 12,
      highIncomeTaxApplied: true,
      salaryAfterDeductions: 14,
      accumulatedPersonalTaxCredit: 15,
      incomeYear: 16,
      maritalStatusCode: 17,
      payMonth: 18,
      childIncomeLimit: 19,
      childBirthYear: 20,
      withholdingRate: 21,
      employerPensionMatch: 22,
      payrollTaxBase: 23,
      payrollTax: 24,
      taxBrackets: [
        {
          lowerBound: 100,
          bracketNumber: 200,
          withholdingRate: 30,
          calculatedWithholding: 400,
        },
      ],
    })
  })

  it('maps an absent result to undefined scalars, never null', () => {
    const empty: WithholdingTaxResult = {}
    const output = toWithholdingTaxOutput(empty)

    expect(output.monthlySalary).toBeUndefined()
    expect(output.appliedPensionFundRatio).toBeUndefined()
    expect(output.appliedPrivatePensionRatio).toBeUndefined()
    expect(output.pensionFundPayment).toBeUndefined()
    expect(output.privatePensionPayment).toBeUndefined()
    expect(output.totalDeductions).toBeUndefined()
    expect(output.personalTaxCredit).toBeUndefined()
    expect(output.spousePersonalTaxCredit).toBeUndefined()
    expect(output.taxBase).toBeUndefined()
    expect(output.calculatedWithholding).toBeUndefined()
    expect(output.paidWithholding).toBeUndefined()
    expect(output.highIncomeTax).toBeUndefined()
    expect(output.highIncomeTaxApplied).toBeUndefined()
    expect(output.salaryAfterDeductions).toBeUndefined()
    expect(output.accumulatedPersonalTaxCredit).toBeUndefined()
    expect(output.incomeYear).toBeUndefined()
    expect(output.maritalStatusCode).toBeUndefined()
    expect(output.payMonth).toBeUndefined()
    expect(output.childIncomeLimit).toBeUndefined()
    expect(output.childBirthYear).toBeUndefined()
    expect(output.withholdingRate).toBeUndefined()
    expect(output.employerPensionMatch).toBeUndefined()
    expect(output.payrollTaxBase).toBeUndefined()
    expect(output.payrollTax).toBeUndefined()
    expect(output.taxBrackets).toEqual([])
  })

  it('falls back to an empty taxBrackets array for both flavours of absence', () => {
    expect(toWithholdingTaxOutput({}).taxBrackets).toEqual([])
    expect(toWithholdingTaxOutput({ skattthrep: null }).taxBrackets).toEqual([])
  })

  it('converts bigint bracket values to numbers without emitting NaN', () => {
    const [bracket] = toWithholdingTaxOutput({
      skattthrep: [{ nedriMork: BigInt(0) }],
    }).taxBrackets

    expect(bracket.lowerBound).toBe(0)
    expect(bracket.bracketNumber).toBeUndefined()
    expect(bracket.withholdingRate).toBeUndefined()
    expect(bracket.calculatedWithholding).toBeUndefined()
  })
})
