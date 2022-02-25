import { PreconditionFailedException } from '@nestjs/common'
import { directTaxPaymentRequest } from './../lib/requests/'

describe('Direct tax payment request', () => {
  describe('Invalid input - throws error', () => {
    test('nationalId is too long', () => {
      expect(() =>
        directTaxPaymentRequest(
          '',
          '',
          '',
          '00000000001',
          {
            year: 2020,
            month: 4,
          },
          {
            year: 2020,
            month: 7,
          },
        ),
      ).toThrowError(PreconditionFailedException)
    })

    test('nationalId is too short', () => {
      expect(() =>
        directTaxPaymentRequest(
          '',
          '',
          '',
          '000000000',
          {
            year: 2020,
            month: 4,
          },
          {
            year: 2020,
            month: 7,
          },
        ),
      ).toThrowError(PreconditionFailedException)
    })

    test('nationalId has non numeric value', () => {
      expect(() =>
        directTaxPaymentRequest(
          '',
          '',
          '',
          '000000000!',
          {
            year: 2020,
            month: 4,
          },
          {
            year: 2020,
            month: 7,
          },
        ),
      ).toThrowError(PreconditionFailedException)
    })

    test('from year is too long', () => {
      expect(() =>
        directTaxPaymentRequest(
          '',
          '',
          '',
          '0000000000',
          {
            year: 20201,
            month: 4,
          },
          {
            year: 2020,
            month: 7,
          },
        ),
      ).toThrowError(PreconditionFailedException)
    })

    test('to year is too long', () => {
      expect(() =>
        directTaxPaymentRequest(
          '',
          '',
          '',
          '0000000000',
          {
            year: 2020,
            month: 4,
          },
          {
            year: 20201,
            month: 7,
          },
        ),
      ).toThrowError(PreconditionFailedException)
    })

    test('from month is too long', () => {
      expect(() =>
        directTaxPaymentRequest(
          '',
          '',
          '',
          '0000000000',
          {
            year: 2020,
            month: 444,
          },
          {
            year: 2020,
            month: 7,
          },
        ),
      ).toThrowError(PreconditionFailedException)
    })

    test('to month is too long', () => {
      expect(() =>
        directTaxPaymentRequest(
          '',
          '',
          '',
          '0000000000',
          {
            year: 2020,
            month: 4,
          },
          {
            year: 2020,
            month: 711,
          },
        ),
      ).toThrowError(PreconditionFailedException)
    })

    test('from year is too short', () => {
      expect(() =>
        directTaxPaymentRequest(
          '',
          '',
          '',
          '0000000000',
          {
            year: 202,
            month: 4,
          },
          {
            year: 2020,
            month: 7,
          },
        ),
      ).toThrowError(PreconditionFailedException)
    })

    test('to year is too short', () => {
      expect(() =>
        directTaxPaymentRequest(
          '',
          '',
          '',
          '0000000000',
          {
            year: 2020,
            month: 4,
          },
          {
            year: 202,
            month: 7,
          },
        ),
      ).toThrowError(PreconditionFailedException)
    })
  })
})
