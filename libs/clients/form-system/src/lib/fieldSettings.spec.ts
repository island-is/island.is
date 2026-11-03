import { FieldSettingsToJSON } from '../../gen/fetch'

describe('Field settings date serialization', () => {
  it.each(['minDate', 'maxDate'] as const)(
    'serializes a cleared %s as null',
    (property) => {
      const settings = FieldSettingsToJSON({ [property]: null })

      expect(settings[property]).toBeNull()
    },
  )

  it('serializes both cleared dates as null', () => {
    const settings = FieldSettingsToJSON({ minDate: null, maxDate: null })

    expect(settings.minDate).toBeNull()
    expect(settings.maxDate).toBeNull()
  })

  it('continues to serialize selected dates as ISO strings', () => {
    const date = new Date('2026-11-03T00:00:00.000Z')
    const settings = FieldSettingsToJSON({ minDate: date, maxDate: date })

    expect(settings.minDate).toBe(date.toISOString())
    expect(settings.maxDate).toBe(date.toISOString())
  })
})
