import { FormValue } from '@island.is/application/types'

import { stripEmptyAnswers, stripEmptyFormValue } from '../strip-empty-answers'

describe('stripEmptyAnswers', () => {
  it('drops top-level empty-string values', () => {
    expect(stripEmptyAnswers({ a: 'x', b: '' })).toEqual({ a: 'x' })
  })

  it('drops whitespace-only strings', () => {
    expect(stripEmptyAnswers({ a: '   ' })).toEqual({})
  })

  it('drops empty strings in nested objects (e.g. applicant.postalCode)', () => {
    const merged: FormValue = {
      applicant: {
        name: 'Gervimaður',
        postalCode: '',
        city: '',
        email: 'a@b.is',
      },
    }
    expect(stripEmptyFormValue(merged)).toEqual({
      applicant: { name: 'Gervimaður', email: 'a@b.is' },
    })
  })

  it('keeps the parent object even when all its children are emptied', () => {
    expect(stripEmptyAnswers({ applicant: { postalCode: '' } })).toEqual({
      applicant: {},
    })
  })

  it('recurses into arrays without dropping elements', () => {
    expect(
      stripEmptyAnswers({ rows: [{ a: 'keep', b: '' }, { a: '' }] }),
    ).toEqual({ rows: [{ a: 'keep' }, {}] })
  })

  it('leaves non-empty-string "empty" shapes (null, [], 0, false) untouched', () => {
    const value = { a: null, b: [], c: 0, d: false }
    expect(stripEmptyAnswers(value)).toEqual(value)
  })

  it('does not mutate the input', () => {
    const input = { applicant: { postalCode: '', name: 'x' } }
    const copy = JSON.parse(JSON.stringify(input))
    stripEmptyAnswers(input)
    expect(input).toEqual(copy)
  })
})
