import { ApolloError } from '@apollo/client'

import { RulingSignatureConfirmationQueryQuery } from '../../graphql/schema'
import { getSigningProcess } from './SigningModal'

type SignatureConfirmation = RulingSignatureConfirmationQueryQuery['rulingSignatureConfirmation']
describe('getSigningProcess', () => {
  test('should return success when document has been signed', () => {
    const signatureConfirmation: SignatureConfirmation = {
      documentSigned: true,
    }

    const result = getSigningProcess(signatureConfirmation, undefined)

    expect(result).toBe('success')
  })

  test('should return canceled', () => {
    const signatureConfirmation: SignatureConfirmation = {
      documentSigned: false,
      code: 7023,
    }

    const result = getSigningProcess(signatureConfirmation, undefined)

    expect(result).toBe('canceled')
  })

  test('should return error if there is an error', () => {
    const result = getSigningProcess(undefined, new ApolloError({}))

    expect(result).toBe('error')
  })

  test('should return error if document is not signed', () => {
    const signatureConfirmation: SignatureConfirmation = {
      documentSigned: false,
    }
    const result = getSigningProcess(signatureConfirmation, undefined)

    expect(result).toBe('error')
  })

  test('should return inProgress when there is no data nor error', () => {
    const result = getSigningProcess(undefined, undefined)

    expect(result).toBe('inProgress')
  })
})
