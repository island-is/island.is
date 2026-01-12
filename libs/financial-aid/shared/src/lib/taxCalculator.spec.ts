import {
  acceptedAmountBreakDown,
  calculateAcceptedAidFinalAmount,
  calculateAidFinalAmount,
  calculateFinalTaxAmount,
  calculatePersonalTaxAllowanceFromAmount,
  calculatePersonalTaxAllowanceUsed,
  calculateTaxOfAmount,
  estimatedBreakDown,
} from './taxCalculator'

describe('Tax calculator', () => {
  describe('calculateAidFinalAmount', () => {
    test('should return number without personal tax allowance amount 100000', () => {
      const amountWithoutTaxAllowance = calculateAidFinalAmount(100000, false)

      expect(amountWithoutTaxAllowance).toEqual(68511)
    })

    test('should return number without personal tax allowance amount is 250000', () => {
      const amountWithoutTaxAllowance = calculateAidFinalAmount(250000, false)

      expect(amountWithoutTaxAllowance).toEqual(171276)
    })

    test('should return number with personal tax allowance amount 100000', () => {
      const amountWithTaxAllowance = calculateAidFinalAmount(100000, true)

      expect(amountWithTaxAllowance).toEqual(100000)
    })

    test('should return number with personal tax allowance amount is 250000', () => {
      const amountWithTaxAllowance = calculateAidFinalAmount(250000, true)

      expect(amountWithTaxAllowance).toEqual(239967)
    })
  })
  describe('calculateTaxOfAmount', () => {
    test('should return tax allowance of 100000', () => {
      const taxOfAmount = calculateTaxOfAmount(100000)
      expect(taxOfAmount).toEqual(31489)
    })
    test('should return tax allowance of 250000', () => {
      const taxOfAmount = calculateTaxOfAmount(250000)
      expect(taxOfAmount).toEqual(78724)
    })
  })
  describe('calculatePersonalTaxAllowanceUsed', () => {
    test('should only show the amount of used personal tax allowence of 100000', () => {
      const personalTaxAllowanceUsed = calculatePersonalTaxAllowanceUsed(
        100000,
        false,
      )
      expect(personalTaxAllowanceUsed).toEqual(0)
    })
    test('should only show the amount of used personal tax allowence of 100000', () => {
      const personalTaxAllowanceUsed = calculatePersonalTaxAllowanceUsed(
        100000,
        true,
      )
      expect(personalTaxAllowanceUsed).toEqual(31489)
    })
    test('should only show the amount of used personal tax allowence of 250000', () => {
      const personalTaxAllowanceUsed = calculatePersonalTaxAllowanceUsed(
        250000,
        false,
      )
      expect(personalTaxAllowanceUsed).toEqual(0)
    })
    test('should only show the amount of used personal tax allowence of 250000', () => {
      const personalTaxAllowanceUsed = calculatePersonalTaxAllowanceUsed(
        250000,
        true,
      )
      expect(personalTaxAllowanceUsed).toEqual(68691)
    })
  })
  describe('calculatePersonalTaxAllowanceFromAmount', () => {
    test('should return 100% personal tax allowence without spouse', () => {
      const personalTaxAllowanceFromAmount =
        calculatePersonalTaxAllowanceFromAmount(Number.MAX_VALUE, 100)
      expect(personalTaxAllowanceFromAmount).toEqual(68691)
    })
    test('should return 80% personal tax allowence without spouse', () => {
      const personalTaxAllowanceFromAmount =
        calculatePersonalTaxAllowanceFromAmount(Number.MAX_VALUE, 80)
      expect(personalTaxAllowanceFromAmount).toEqual(54952)
    })
    test('should return 30% personal tax allowence without spouse', () => {
      const personalTaxAllowanceFromAmount =
        calculatePersonalTaxAllowanceFromAmount(Number.MAX_VALUE, 30)
      expect(personalTaxAllowanceFromAmount).toEqual(20607)
    })
    test('should return 100% personal tax allowence with 100% spouse allowance', () => {
      const personalTaxAllowanceFromAmount =
        calculatePersonalTaxAllowanceFromAmount(Number.MAX_VALUE, 100, 100)
      expect(personalTaxAllowanceFromAmount).toEqual(137382)
    })
    test('should return 80% personal tax allowence with 10% spouse', () => {
      const personalTaxAllowanceFromAmount =
        calculatePersonalTaxAllowanceFromAmount(Number.MAX_VALUE, 80, 10)
      expect(personalTaxAllowanceFromAmount).toEqual(61821)
    })
    test('should return 30% personal tax allowence with 50% spouse', () => {
      const personalTaxAllowanceFromAmount =
        calculatePersonalTaxAllowanceFromAmount(Number.MAX_VALUE, 30, 50)
      expect(personalTaxAllowanceFromAmount).toEqual(54952)
    })
    test('should return the personal tax allowence as equal to the tax amount arguement', () => {
      const personalTaxAllowanceFromAmount =
        calculatePersonalTaxAllowanceFromAmount(20000, 100)
      expect(personalTaxAllowanceFromAmount).toEqual(20000)
    })
  })
  describe('calculateAcceptedAidFinalAmount', () => {
    test('should return accepted final amount with 100% personal and 100% spouse credit', () => {
      const acceptedAidFinalAmount = calculateAcceptedAidFinalAmount(
        100000,
        100,
        0,
      )
      expect(acceptedAidFinalAmount).toEqual(99900)
    })
    test('should return accepted final amount with 100% personal and 100% spouse credit, adding children aid', () => {
      const acceptedAidFinalAmount = calculateAcceptedAidFinalAmount(
        100000,
        100,
        40000,
      )
      expect(acceptedAidFinalAmount).toEqual(139900)
    })
    test('should return accepted final amount with 10% personal and 30% spouse credit', () => {
      const acceptedAidFinalAmount = calculateAcceptedAidFinalAmount(
        300000,
        64926,
        0,
      )
      expect(acceptedAidFinalAmount).toEqual(235074)
    })
    test('should return accepted final amount with 10% personal and 30% spouse credit', () => {
      const acceptedAidFinalAmount = calculateAcceptedAidFinalAmount(
        150000,
        50000,
        0,
      )
      expect(acceptedAidFinalAmount).toEqual(100000)
    })
    test('should return accepted final amount with 10% personal and 30% spouse credit, adding children aid', () => {
      const acceptedAidFinalAmount = calculateAcceptedAidFinalAmount(
        150000,
        50000,
        50000,
      )
      expect(acceptedAidFinalAmount).toEqual(150000)
    })
  })
  describe('calculateFinalTaxAmount', () => {
    test('should return final amount with 100% personal and 0% spouse credit', () => {
      const finalTaxAmount = calculateFinalTaxAmount(300000, 100, 0)
      expect(finalTaxAmount).toEqual(25778)
    })
    test('should return final amount with 100% personal and 100% spouse credit', () => {
      const finalTaxAmount = calculateFinalTaxAmount(300000, 100, 100)
      expect(finalTaxAmount).toEqual(0)
    })
    test('should return final amount with 50% personal and 50% spouse credit', () => {
      const finalTaxAmount = calculateFinalTaxAmount(300000, 50, 50)
      expect(finalTaxAmount).toEqual(25779)
    })
  })
  describe('estimatedBreakDown', () => {
    test('should return estimated breakdown from 10000 without personal tax credit', () => {
      const breakdown = estimatedBreakDown(100000)
      expect(breakdown).toEqual([
        {
          title: 'Grunnupphæð',
          calculation: `+ 100.000 kr.`,
        },
        {
          title: 'Skattur',
          calculation: `- 31.489 kr.`,
        },
        {
          title: 'Persónuafsláttur',
          calculation: `0 kr. `,
        },
        {
          title: 'Áætluð aðstoð (hámark)',
          calculation: `68.511 kr.`,
        },
      ])
    })
    test('should return estimated breakdown from 10000 with personal tax credit', () => {
      const breakdown = estimatedBreakDown(100000, true)
      expect(breakdown).toEqual([
        {
          title: 'Grunnupphæð',
          calculation: `+ 100.000 kr.`,
        },
        {
          title: 'Skattur',
          calculation: `- 31.489 kr.`,
        },
        {
          title: 'Persónuafsláttur',
          calculation: `+ 31.489 kr. `,
        },
        {
          title: 'Áætluð aðstoð (hámark)',
          calculation: `100.000 kr.`,
        },
      ])
    })
    test('should return estimated breakdown from 250000 without personal tax credit', () => {
      const breakdown = estimatedBreakDown(250000)
      expect(breakdown).toEqual([
        {
          title: 'Grunnupphæð',
          calculation: `+ 250.000 kr.`,
        },
        {
          title: 'Skattur',
          calculation: `- 78.724 kr.`,
        },
        {
          title: 'Persónuafsláttur',
          calculation: `0 kr. `,
        },
        {
          title: 'Áætluð aðstoð (hámark)',
          calculation: `171.276 kr.`,
        },
      ])
    })
    test('should return estimated breakdown from 250000 with personal tax credit', () => {
      const breakdown = estimatedBreakDown(250000, true)
      expect(breakdown).toEqual([
        {
          title: 'Grunnupphæð',
          calculation: `+ 250.000 kr.`,
        },
        {
          title: 'Skattur',
          calculation: `- 78.724 kr.`,
        },
        {
          title: 'Persónuafsláttur',
          calculation: `+ 68.691 kr. `,
        },
        {
          title: 'Áætluð aðstoð (hámark)',
          calculation: `239.967 kr.`,
        },
      ])
    })
  })
  describe('acceptedAmountBreakDown', () => {
    test('should return empty array', () => {
      const amountBreakdown = acceptedAmountBreakDown()
      expect(amountBreakdown).toEqual([])
    })
    test('should return empty array', () => {
      const amountBreakdown = acceptedAmountBreakDown(undefined)
      expect(amountBreakdown).toEqual([])
    })
    test('should return amount from 100.000', () => {
      const amountBreakdown = acceptedAmountBreakDown({
        aidAmount: 100000,
        personalTaxCredit: 0,
        tax: 31450,
        finalAmount: 68550,
      })
      expect(amountBreakdown).toEqual([
        {
          title: 'Grunnupphæð',
          calculation: `+ 100.000 kr.`,
        },
        {
          title: 'Tekjur',
          calculation: `0 kr.`,
        },
        {
          title: 'Skattur',
          calculation: `- 31.450 kr.`,
        },
        {
          title: 'Persónuafsláttur',
          calculation: ` 0 kr.`,
        },
        {
          title: 'Aðstoð',
          calculation: `68.550 kr.`,
        },
      ])
    })
    test('should return amount from 100.000 with income and deductionFactors', () => {
      const amountBreakdown = acceptedAmountBreakDown({
        aidAmount: 100000,
        income: 20000,
        personalTaxCredit: 80,
        tax: 51450,
        finalAmount: 68550,
        deductionFactors: [
          {
            amount: 7000,
            description: 'Tekjur maka',
          },
          {
            amount: 10000,
            description: 'Bíll',
          },
        ],
      })
      expect(amountBreakdown).toEqual([
        {
          title: 'Grunnupphæð',
          calculation: `+ 100.000 kr.`,
        },
        {
          title: 'Tekjur',
          calculation: `- 20.000 kr.`,
        },
        {
          title: 'Tekjur maka',
          calculation: `- 7.000 kr.`,
        },
        {
          title: 'Bíll',
          calculation: `- 10.000 kr.`,
        },
        {
          title: 'Skattur',
          calculation: `- 51.450 kr.`,
        },
        {
          title: 'Persónuafsláttur',
          calculation: `+ 51.450 kr.`,
        },
        {
          title: 'Aðstoð',
          calculation: `68.550 kr.`,
        },
      ])
    })
    test('should return amount from 250.000', () => {
      const amountBreakdown = acceptedAmountBreakDown({
        aidAmount: 250000,
        personalTaxCredit: 0,
        tax: 78625,
        finalAmount: 171375,
      })
      expect(amountBreakdown).toEqual([
        {
          title: 'Grunnupphæð',
          calculation: `+ 250.000 kr.`,
        },
        {
          title: 'Tekjur',
          calculation: `0 kr.`,
        },
        {
          title: 'Skattur',
          calculation: `- 78.625 kr.`,
        },
        {
          title: 'Persónuafsláttur',
          calculation: ` 0 kr.`,
        },
        {
          title: 'Aðstoð',
          calculation: `171.375 kr.`,
        },
      ])
    })
    test('should return amount from 250.000', () => {
      const amountBreakdown = acceptedAmountBreakDown({
        aidAmount: 200000,
        childrenAidAmount: 50000,
        personalTaxCredit: 0,
        tax: 78625,
        finalAmount: 171375,
      })
      expect(amountBreakdown).toEqual([
        {
          title: 'Grunnupphæð',
          calculation: `+ 200.000 kr.`,
        },
        {
          title: 'Styrkur vegna barna',
          calculation: `+ 50.000 kr.`,
        },
        {
          title: 'Tekjur',
          calculation: `0 kr.`,
        },
        {
          title: 'Skattur',
          calculation: `- 78.625 kr.`,
        },
        {
          title: 'Persónuafsláttur',
          calculation: ` 0 kr.`,
        },
        {
          title: 'Aðstoð',
          calculation: `171.375 kr.`,
        },
      ])
    })
    test('should return amount from 250.000 with income and deductionFactors', () => {
      const amountBreakdown = acceptedAmountBreakDown({
        aidAmount: 250000,
        income: 20000,
        personalTaxCredit: 100,
        tax: 78625,
        finalAmount: 225291,
        deductionFactors: [
          {
            amount: 7000,
            description: 'Tekjur maka',
          },
          {
            amount: 10000,
            description: 'Bíll',
          },
        ],
      })
      expect(amountBreakdown).toEqual([
        {
          title: 'Grunnupphæð',
          calculation: `+ 250.000 kr.`,
        },
        {
          title: 'Tekjur',
          calculation: `- 20.000 kr.`,
        },
        {
          title: 'Tekjur maka',
          calculation: `- 7.000 kr.`,
        },
        {
          title: 'Bíll',
          calculation: `- 10.000 kr.`,
        },
        {
          title: 'Skattur',
          calculation: `- 78.625 kr.`,
        },
        {
          title: 'Persónuafsláttur',
          calculation: `+ 68.691 kr.`,
        },
        {
          title: 'Aðstoð',
          calculation: `225.291 kr.`,
        },
      ])
    })
  })
})
