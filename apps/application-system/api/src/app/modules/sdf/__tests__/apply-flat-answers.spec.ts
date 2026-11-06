import type { FormValue } from '@island.is/application/types'

import { applyFlatAnswers } from '../apply-flat-answers'

describe('applyFlatAnswers', () => {
  it('expands a dotted client key into a nested object', () => {
    expect(
      applyFlatAnswers({}, { 'applicant.phoneNumber': '+3545812345' }),
    ).toEqual({
      applicant: { phoneNumber: '+3545812345' },
    })
  })

  it('keeps nested siblings when setting a dotted key', () => {
    const base = {
      applicant: { name: 'Gervimaður', email: 'a@b.is' },
    }
    // A dotted key must land at its nested path; left under the flat key,
    // `applicant.phoneNumber` would read as undefined and fail validation as
    // required.
    expect(
      applyFlatAnswers(base, { 'applicant.phoneNumber': '+3545812345' }),
    ).toEqual({
      applicant: {
        name: 'Gervimaður',
        email: 'a@b.is',
        phoneNumber: '+3545812345',
      },
    })
  })

  it('keeps plain top-level keys flat', () => {
    expect(
      applyFlatAnswers({}, { description: 'hi', usageUnits: ['a', 'b'] }),
    ).toEqual({ description: 'hi', usageUnits: ['a', 'b'] })
  })

  it('does not mutate the base tree', () => {
    const base = { applicant: { name: 'Gervimaður' } }
    applyFlatAnswers(base, { 'applicant.phoneNumber': '+3545812345' })
    expect(base).toEqual({ applicant: { name: 'Gervimaður' } })
  })

  it('does not mutate or share objects with the client payload', () => {
    const payload = { applicant: { name: 'B' }, 'applicant.phone': '1' }
    const result = applyFlatAnswers({}, payload)
    expect(payload).toEqual({
      applicant: { name: 'B' },
      'applicant.phone': '1',
    })
    expect(result.applicant).not.toBe(payload.applicant)
  })

  it('treats undefined client answers as a no-op clone', () => {
    const base = { applicant: { name: 'Gervimaður' } }
    expect(applyFlatAnswers(base, undefined)).toEqual(base)
  })

  it('stores null as a value instead of deleting the key', () => {
    expect(applyFlatAnswers({ selection: 'x' }, { selection: null })).toEqual({
      selection: null,
    })
  })

  it('applies a dotted key and an object value in key order', () => {
    const base = { applicant: { name: 'A', phone: '0' } }
    expect(
      applyFlatAnswers(base, {
        'applicant.phone': '1',
        applicant: { name: 'B' },
      }),
    ).toEqual({ applicant: { name: 'B' } })
    expect(
      applyFlatAnswers(base, {
        applicant: { name: 'B' },
        'applicant.phone': '1',
      }),
    ).toEqual({ applicant: { name: 'B', phone: '1' } })
  })

  // A field owns its whole value under its key: an object or array value
  // replaces what is stored there, so the client must send the complete value.
  describe('whole-value replacement', () => {
    it('replaces a stored object with an incoming object value', () => {
      const base = { applicant: { name: 'A', email: 'a@b.is' } }
      expect(applyFlatAnswers(base, { applicant: { name: 'B' } })).toEqual({
        applicant: { name: 'B' },
      })
    })

    it('replaces a stored array wholesale, even when shorter or reshaped', () => {
      const base = {
        files: [
          { name: 'a', key: 'k1', extra: 1 },
          { name: 'b', key: 'k2' },
        ],
      } as FormValue
      expect(
        applyFlatAnswers(base, { files: [{ name: 'c', key: 'k3' }] }),
      ).toEqual({ files: [{ name: 'c', key: 'k3' }] })
    })
  })

  // Field ids can address array items with either `list[0].key` or
  // `list.0.key`.
  describe('index paths', () => {
    const absence = () =>
      ({ absence: [{ a: 1, x: 'keep' }, { a: 2 }] } as FormValue)

    it('sets one item field with bracket notation', () => {
      expect(applyFlatAnswers(absence(), { 'absence[0].a': 9 })).toEqual({
        absence: [{ a: 9, x: 'keep' }, { a: 2 }],
      })
    })

    it('sets one item field with dotted-index notation', () => {
      expect(applyFlatAnswers(absence(), { 'absence.1.a': 9 })).toEqual({
        absence: [{ a: 1, x: 'keep' }, { a: 9 }],
      })
    })

    it('creates an array, not an object, when nothing is stored', () => {
      const result = applyFlatAnswers({}, { 'f.0.id': 'a' })
      expect(result).toEqual({ f: [{ id: 'a' }] })
      expect(Array.isArray(result.f)).toBe(true)
    })

    it('leaves a hole when the index is beyond the stored length', () => {
      // The hole serializes to `null` in JSON.
      const result = applyFlatAnswers({ f: [{ id: 'a' }] }, { 'f.2.id': 'c' })
      const f = result.f as unknown[]
      expect(f).toHaveLength(3)
      expect(1 in f).toBe(false)
      expect(f[0]).toEqual({ id: 'a' })
      expect(f[2]).toEqual({ id: 'c' })
    })

    it('replaces a primitive or null parent with an object', () => {
      expect(applyFlatAnswers({ p: 'str' }, { 'p.code': 'X' })).toEqual({
        p: { code: 'X' },
      })
      // `null` isn't an `Answer`, but stored answers can still contain it.
      expect(
        applyFlatAnswers({ p: null } as unknown as FormValue, {
          'p.code': 'X',
        }),
      ).toEqual({
        p: { code: 'X' },
      })
    })
  })
})
