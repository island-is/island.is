import { PreconditionFailedException } from '@nestjs/common'
import { pdfRequest } from './../lib/requests/pdf'

describe('Pdf request', () => {
  describe('Invalid input - throws error', () => {
    test('year is too long', () => {
      expect(() => pdfRequest('', '', '', '0000000000', 19999)).toThrowError(
        PreconditionFailedException,
      )
    })

    test('year is too short', () => {
      expect(() => pdfRequest('', '', '', '0000000000', 199)).toThrowError(
        PreconditionFailedException,
      )
    })

    test('nationalId is too long', () => {
      expect(() => pdfRequest('', '', '', '00000000001', 1999)).toThrowError(
        PreconditionFailedException,
      )
    })

    test('nationalId is too short', () => {
      expect(() => pdfRequest('', '', '', '000000000', 1999)).toThrowError(
        PreconditionFailedException,
      )
    })

    test('nationalId has non numeric value', () => {
      expect(() => pdfRequest('', '', '', '000000000!', 1999)).toThrowError(
        PreconditionFailedException,
      )
    })
  })
})
