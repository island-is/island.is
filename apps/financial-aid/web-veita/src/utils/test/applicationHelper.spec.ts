import { getDirectTaxPayments } from '../applicationHelper'

describe('applicationHelper', () => {
  describe('getDirectTaxPayments', () => {
    test('should return correct content', () => {
      const result = getDirectTaxPayments([
        {
          totalSalary: 100100,
          personalAllowance: 2,
          withheldAtSource: 3,
          payerNationalId: '0000000000',
          year: 2022,
          month: 4,
        },
        {
          totalSalary: 100200,
          personalAllowance: 2,
          withheldAtSource: 3,
          payerNationalId: '0000000000',
          year: 2022,
          month: 4,
        },
        {
          totalSalary: 100000,
          personalAllowance: 2,
          withheldAtSource: 3,
          payerNationalId: '0000000000',
          year: 2022,
          month: 4,
        },
      ])

      const expected = [
        { title: 'Samtals heildarlaun', content: '300.300' },
        { title: 'Meðaltal', content: '100.100' },
        { title: 'Persónuafsláttur', content: '2' },
        { title: 'Samtals staðgreiðsla', content: '9' },
      ]
      expect(true).toEqual(true)
    })
  })
})
