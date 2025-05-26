import { ApolloError } from '@apollo/client'

import { GetRulingSignatureConfirmationQuery } from './getRulingSignatureConfirmation.generated'
import { getSigningProgress } from './SigningModal'

type SignatureConfirmation =
  GetRulingSignatureConfirmationQuery['rulingSignatureConfirmation']
describe('getSigningProcess', () => {
  test('should return success when document has been signed', () => {
    const signatureConfirmation: SignatureConfirmation = {
      documentSigned: true,
    }

    const result = getSigningProgress(signatureConfirmation, undefined)

    expect(result).toBe('success')
  })

  test('should return canceled', () => {
    const signatureConfirmation: SignatureConfirmation = {
      documentSigned: false,
      code: 7023,
    }

    const result = getSigningProgress(signatureConfirmation, undefined)

    expect(result).toBe('canceled')
  })

  test('should return error if there is an error', () => {
    const result = getSigningProgress(undefined, new ApolloError({}))

    expect(result).toBe('error')
  })

  test('should return error if document is not signed', () => {
    const signatureConfirmation: SignatureConfirmation = {
      documentSigned: false,
    }
    const result = getSigningProgress(signatureConfirmation, undefined)

    expect(result).toBe('error')
  })

  test('should return inProgress when there is no data nor error', () => {
    const result = getSigningProgress(undefined, undefined)

    expect(result).toBe('inProgress')
  })
})
