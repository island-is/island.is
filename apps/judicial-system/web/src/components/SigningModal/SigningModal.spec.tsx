import { ApolloError } from '@apollo/client'
import { createIntl } from 'react-intl'

import { CaseType } from '@island.is/judicial-system/types'

import { RulingSignatureConfirmationQueryQuery } from '../../graphql/schema'
import { getSigningProcess, getSuccessText } from './SigningModal'

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

describe('getSuccessText', () => {
  const formatMessage = createIntl({ locale: 'is', onError: jest.fn() })
    .formatMessage
  const fn = (caseType: CaseType) => getSuccessText(formatMessage, caseType)

  test('should format investigation case', () => {
    expect(fn(CaseType.BODY_SEARCH)).toEqual(
      'Úrskurður hefur verið sendur á ákæranda, dómritara og dómara sem kvað upp úrskurð. Úrskurðir eru eingöngu sendir á verjanda eða talsmann varnaraðila séu þeir viðstaddir þinghald.<br/><br/>Þú getur komið ábendingum á framfæri við þróunarteymi Réttarvörslugáttar um það sem mætti betur fara í vinnslu mála með því að smella á takkann hér fyrir neðan.',
    )
  })

  test('should format custody case', () => {
    expect(fn(CaseType.CUSTODY)).toEqual(
      'Úrskurður hefur verið sendur á ákæranda, verjanda og dómara sem kvað upp úrskurð. Auk þess hefur útdráttur verið sendur á fangelsi.<br/><br/>Þú getur komið ábendingum á framfæri við þróunarteymi Réttarvörslugáttar um það sem mætti betur fara í vinnslu mála með því að smella á takkann hér fyrir neðan.',
    )
  })

  test('should format admission case', () => {
    expect(fn(CaseType.ADMISSION_TO_FACILITY)).toEqual(
      'Úrskurður hefur verið sendur á ákæranda, verjanda og dómara sem kvað upp úrskurð. Auk þess hefur útdráttur verið sendur á fangelsi.<br/><br/>Þú getur komið ábendingum á framfæri við þróunarteymi Réttarvörslugáttar um það sem mætti betur fara í vinnslu mála með því að smella á takkann hér fyrir neðan.',
    )
  })

  test('should format travel ban case', () => {
    expect(fn(CaseType.TRAVEL_BAN)).toEqual(
      'Úrskurður hefur verið sendur á ákæranda, verjanda og dómara sem kvað upp úrskurð.<br/><br/>Þú getur komið ábendingum á framfæri við þróunarteymi Réttarvörslugáttar um það sem mætti betur fara í vinnslu mála með því að smella á takkann hér fyrir neðan.',
    )
  })
})
