import { GraphQLError } from 'graphql'
import { ApolloError } from '@apollo/client'

import {
  describeError,
  describeResult,
  isCaseId,
  parseDays,
} from './CaseLifetime.logic'

describe('CaseLifetime logic', () => {
  describe('isCaseId', () => {
    it('should accept a guid, with surrounding whitespace', () => {
      expect(isCaseId(' 6756ac13-a8fd-4594-8c38-c90a0dbe16ec ')).toBe(true)
    })

    it.each(['', '6756ac13', '6756ac13-a8fd-4594-8c38-c90a0dbe16eg'])(
      'should reject %p',
      (value) => {
        expect(isCaseId(value)).toBe(false)
      },
    )
  })

  describe('parseDays', () => {
    it.each([
      ['0', 0],
      [' 30 ', 30],
      ['3650', 3650],
    ])('should parse %p', (value, days) => {
      expect(parseDays(value)).toBe(days)
    })

    it.each(['', '-1', '1.5', '3651', '30 days', '1e2'])(
      'should reject %p',
      (value) => {
        expect(parseDays(value)).toBeUndefined()
      },
    )
  })

  describe('describeResult', () => {
    const archiveNotBefore = '2027-03-05T12:00:00.000Z'

    it('should say until when a case is kept', () => {
      expect(describeResult({ archiveNotBefore, caseRestored: false })).toBe(
        'Málið verður ekki sett í geymslu fyrir 5.3.2027.',
      )
    })

    it('should say that the case was brought back from the archive', () => {
      expect(describeResult({ archiveNotBefore, caseRestored: true })).toBe(
        'Málið var sótt úr geymslu og verður ekki sett aftur í geymslu fyrir 5.3.2027.',
      )
    })

    it('should say that an extension was removed', () => {
      expect(
        describeResult({ archiveNotBefore: null, caseRestored: false }),
      ).toBe('Framlenging var fjarlægð. Málið fylgir nú venjulegum líftíma.')
    })
  })

  describe('describeError', () => {
    it('should return the reason the backend gave', () => {
      const error = new ApolloError({
        graphQLErrors: [
          new GraphQLError('Bad Request', {
            extensions: { problem: { detail: 'The archive does not fit' } },
          }),
        ],
      })

      expect(describeError(error)).toBe('The archive does not fit')
    })

    it('should return nothing for an error without a reason', () => {
      expect(describeError(new ApolloError({}))).toBeUndefined()
      expect(describeError(new Error('Network down'))).toBeUndefined()
    })
  })
})
