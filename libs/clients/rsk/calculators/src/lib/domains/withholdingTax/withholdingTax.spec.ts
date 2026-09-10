import type { CalculatorField } from '../../contracts/field'
import type { WithholdingTaxInput } from './contract'
import { withholdingTaxCalculator } from './contract'
import { toWithholdingTaxQuery } from './withholdingTax'

const fieldsByName: Record<string, CalculatorField> = Object.fromEntries(
  withholdingTaxCalculator.inputFields.map((field) => [field.name, field]),
)

describe('withholdingTax contract', () => {
  it('declares each field as authored', () => {
    expect(Object.keys(fieldsByName).sort()).toEqual([
      'accumulatedPersonalTaxCredit',
      'employerPensionMatchRatio',
      'incomeYear',
      'maritalStatus',
      'otherDeduction',
      'payMonth',
      'paymentFrequency',
      'pensionFundRatio',
      'privatePensionRatio',
      'salary',
      'seamenAccidentInsurancePremium',
      'spouseTaxCardUtilization',
      'taxCardUtilization',
      'unionDues',
      'vacationPay',
      'vehicleAllowance',
    ])
    expect(fieldsByName).toMatchObject({
      paymentFrequency: {
        type: 'select',
        options: [{ value: 'weekly' }, { value: 'monthly' }],
      },
      maritalStatus: {
        type: 'select',
        options: [
          { value: 'single' },
          { value: 'singleParent' },
          { value: 'marriedOrCohabiting' },
        ],
      },
      incomeYear: { type: 'number', semantic: 'year' },
      payMonth: { type: 'number', semantic: 'month' },
      salary: { type: 'number', semantic: 'currency' },
      pensionFundRatio: {
        type: 'select',
        options: [{ value: '0%' }, { value: '4%' }],
      },
      privatePensionRatio: {
        type: 'select',
        options: [
          { value: '0%' },
          { value: '1%' },
          { value: '2%' },
          { value: '3%' },
          { value: '4%' },
        ],
      },
      taxCardUtilization: { type: 'number', semantic: 'percentage' },
      spouseTaxCardUtilization: { type: 'number', semantic: 'percentage' },
      accumulatedPersonalTaxCredit: { type: 'number', semantic: 'currency' },
      vacationPay: { type: 'number', semantic: 'currency' },
      unionDues: { type: 'number', semantic: 'currency' },
      otherDeduction: { type: 'number', semantic: 'currency' },
      employerPensionMatchRatio: {
        type: 'select',
        options: [
          { value: '0%' },
          { value: '8%' },
          { value: '8.5%' },
          { value: '10%' },
          { value: '10.5%' },
          { value: '11.5%' },
          { value: '12%' },
          { value: '13.5%' },
        ],
      },
      vehicleAllowance: { type: 'number', semantic: 'currency' },
      seamenAccidentInsurancePremium: { type: 'number', semantic: 'currency' },
    })
  })

  it('marks every field optional', () => {
    for (const field of withholdingTaxCalculator.inputFields) {
      expect(field.required).toBe(false)
    }
  })
})

describe('toWithholdingTaxQuery', () => {
  const input: WithholdingTaxInput = {
    paymentFrequency: 'monthly',
    maritalStatus: 'marriedOrCohabiting',
    incomeYear: 2025,
    payMonth: 6,
    salary: 900000,
    pensionFundRatio: '4%',
    privatePensionRatio: '2%',
    taxCardUtilization: 1,
    spouseTaxCardUtilization: 0.5,
    accumulatedPersonalTaxCredit: 120000,
    vacationPay: 80000,
    unionDues: 9000,
    otherDeduction: 5000,
    employerPensionMatchRatio: '11.5%',
    vehicleAllowance: 30000,
    seamenAccidentInsurancePremium: 4000,
  }

  it('emits every RSK parameter and nothing else', () => {
    expect(toWithholdingTaxQuery(input)).toEqual({
      launGreidast: true,
      hjuskaparstada: 3,
      tekjuar: 2025,
      launamanudur: 6,
      laun: 900000,
      lifeyrissjodurHlutfall: 0.04,
      sereignHlutfall: 0.02,
      nytingSkattkorts: 1,
      nytingSkattkortsMaka: 0.5,
      uppsafnadurPersonuafslattur: 120000,
      orlof: 80000,
      stettarfelag: 9000,
      annad: 5000,
      motframlagLifeyrissjodur: 0.115,
      okutaekjastyrkurUtan: 30000,
      idgjaldSlysatryggingSjomanna: 4000,
    })
  })

  it('emits every parameter as undefined for an empty input', () => {
    const query = toWithholdingTaxQuery({})

    expect(Object.keys(query ?? {}).sort()).toEqual([
      'annad',
      'hjuskaparstada',
      'idgjaldSlysatryggingSjomanna',
      'laun',
      'launGreidast',
      'launamanudur',
      'lifeyrissjodurHlutfall',
      'motframlagLifeyrissjodur',
      'nytingSkattkorts',
      'nytingSkattkortsMaka',
      'okutaekjastyrkurUtan',
      'orlof',
      'sereignHlutfall',
      'stettarfelag',
      'tekjuar',
      'uppsafnadurPersonuafslattur',
    ])
    expect(Object.values(query ?? {}).every((v) => v === undefined)).toBe(true)
  })

  it('maps the ratio option values to the 0-1 numbers RSK expects', () => {
    expect(
      toWithholdingTaxQuery({
        paymentFrequency: 'weekly',
        pensionFundRatio: '0%',
        privatePensionRatio: '4%',
        employerPensionMatchRatio: '8.5%',
        maritalStatus: 'singleParent',
      }),
    ).toMatchObject({
      launGreidast: false,
      lifeyrissjodurHlutfall: 0,
      sereignHlutfall: 0.04,
      motframlagLifeyrissjodur: 0.085,
      hjuskaparstada: 2,
    })
  })
})
