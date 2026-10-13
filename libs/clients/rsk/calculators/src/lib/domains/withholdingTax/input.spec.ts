import type { WithholdingTaxInput } from './definition'
import { toWithholdingTaxQuery } from './input'

describe('toWithholdingTaxQuery', () => {
  const input: WithholdingTaxInput = {
    paymentFrequency: 'monthly',
    maritalStatus: 'marriedOrCohabiting',
    incomeYear: 2025,
    payMonth: 6,
    salary: 900000,
    pensionFundRatio: '4%',
    privatePensionRatio: '2%',
    taxCardUtilization: 37,
    spouseTaxCardUtilization: 50,
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
      nytingSkattkorts: 0.37,
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

  it('maps the select ratio options to the 0-1 numbers RSK expects', () => {
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

  it('divides the percentage inputs into the 0-1 ratios RSK expects', () => {
    expect(
      toWithholdingTaxQuery({
        taxCardUtilization: 33.33,
        spouseTaxCardUtilization: 0,
      }),
    ).toMatchObject({
      nytingSkattkorts: 0.3333,
      nytingSkattkortsMaka: 0,
    })
  })
})
