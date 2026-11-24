import { ApolloError } from '@apollo/client'
import { GraphQLError } from 'graphql'

import {
  clearedOwnContactFields,
  ownContactFieldErrors,
  toE164,
} from './useOwnContact'

const validationError = (mmsFields: unknown) =>
  new ApolloError({
    graphQLErrors: [
      new GraphQLError('Validation failed', {
        extensions: {
          problem: {
            type: 'https://httpstatuses.org/400',
            status: 400,
            mmsCode: 'VALIDATION',
            mmsFields,
          },
        },
      }),
    ],
  })

describe('toE164', () => {
  it.each([
    ['', null],
    ['   ', null],
    ['5812345', '+3545812345'],
    ['581 2345', '+3545812345'],
    ['581-2345', '+3545812345'],
    ['+45 12 34 56 78', '+4512345678'],
  ])('turns %p into %p', (input, expected) => {
    expect(toE164(input)).toBe(expected)
  })
})

describe('clearedOwnContactFields', () => {
  const stored = { phone: '+3545812345', email: 'a@b.is' }

  it('names a stored field that was emptied', () => {
    expect(clearedOwnContactFields(stored, { ...stored, phone: '  ' })).toEqual([
      'phone',
    ])
  })

  it('names both when both were emptied', () => {
    expect(clearedOwnContactFields(stored, { phone: '', email: '' })).toEqual([
      'phone',
      'email',
    ])
  })

  it('ignores fields that were empty already', () => {
    expect(
      clearedOwnContactFields(
        { phone: '', email: 'a@b.is' },
        { phone: '', email: 'c@d.is' },
      ),
    ).toEqual([])
  })
})

describe('ownContactFieldErrors', () => {
  it('returns the known fields MMS named', () => {
    expect(ownContactFieldErrors(validationError(['phone', 'other']))).toEqual([
      'phone',
    ])
  })

  it('returns nothing for an error without fields', () => {
    expect(ownContactFieldErrors(validationError(undefined))).toEqual([])
  })

  it('returns nothing for errors that are not from Apollo', () => {
    expect(ownContactFieldErrors(new Error('boom'))).toEqual([])
  })
})
