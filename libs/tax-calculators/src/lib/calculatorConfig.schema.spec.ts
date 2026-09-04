import {
  calculatorConfigSchema,
  collectSectionToggles,
} from './calculatorConfig.schema'

const field = (overrides = {}) => ({
  uid: 'f1',
  key: 'income',
  span: 12,
  ...overrides,
})

const section = (overrides = {}) => ({
  key: 's1',
  fields: [field()],
  ...overrides,
})

describe('calculatorConfigSchema', () => {
  it('accepts a minimal config', () => {
    const result = calculatorConfigSchema.safeParse({ sections: [section()] })
    expect(result.success).toBe(true)
  })

  it('strips keys it does not declare', () => {
    const result = calculatorConfigSchema.safeParse({
      sections: [section({ somethingElse: 'dropped' })],
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.sections[0]).not.toHaveProperty('somethingElse')
    }
  })

  describe('required identity', () => {
    it('rejects a field with no uid', () => {
      const { uid, ...withoutUid } = field()
      const result = calculatorConfigSchema.safeParse({
        sections: [section({ fields: [withoutUid] })],
      })
      expect(result.success).toBe(false)
    })

    it('rejects a duplicate field uid across sections', () => {
      const result = calculatorConfigSchema.safeParse({
        sections: [
          section({ key: 's1', fields: [field({ uid: 'dupe' })] }),
          section({ key: 's2', fields: [field({ uid: 'dupe' })] }),
        ],
      })
      expect(result.success).toBe(false)
    })

    it('rejects a duplicate section key', () => {
      const result = calculatorConfigSchema.safeParse({
        sections: [
          section({ key: 'same', fields: [field({ uid: 'a' })] }),
          section({ key: 'same', fields: [field({ uid: 'b' })] }),
        ],
      })
      expect(result.success).toBe(false)
    })
  })

  describe('gates', () => {
    it('accepts a gate pointing at a toggle another section declares', () => {
      const result = calculatorConfigSchema.safeParse({
        sections: [
          section({
            key: 'owner',
            toggle: { key: 't1', label: { is: 'Kveikja' } },
            fields: [field({ uid: 'a' })],
          }),
          section({
            key: 'gated',
            gate: { toggle: 't1' },
            fields: [field({ uid: 'b' })],
          }),
        ],
      })
      expect(result.success).toBe(true)
    })

    // The failure this guards against is silent: on the web side an unresolved
    // gate reads as "off", so the section renders unconditionally.
    it('rejects a gate pointing at a toggle no section declares', () => {
      const result = calculatorConfigSchema.safeParse({
        sections: [section({ gate: { toggle: 'ghost' } })],
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual([
          'sections',
          0,
          'gate',
          'toggle',
        ])
      }
    })

    it('rejects a gate left dangling by removing the section that owned it', () => {
      const withOwner = {
        sections: [
          section({
            key: 'owner',
            toggle: { key: 't1', label: { is: 'Kveikja' } },
            fields: [field({ uid: 'a' })],
          }),
          section({
            key: 'gated',
            gate: { toggle: 't1' },
            fields: [field({ uid: 'b' })],
          }),
        ],
      }
      expect(calculatorConfigSchema.safeParse(withOwner).success).toBe(true)

      const ownerRemoved = { sections: withOwner.sections.slice(1) }
      expect(calculatorConfigSchema.safeParse(ownerRemoved).success).toBe(false)
    })
  })

  describe('span', () => {
    it.each([0, 13, 1.5])('rejects %p', (span) => {
      const result = calculatorConfigSchema.safeParse({
        sections: [section({ fields: [field({ span })] })],
      })
      expect(result.success).toBe(false)
    })
  })
})

describe('collectSectionToggles', () => {
  it('returns every declared toggle and nothing else', () => {
    const toggles = collectSectionToggles({
      sections: [
        section({ key: 'a', toggle: { key: 't1', label: { is: 'Eitt' } } }),
        section({ key: 'b' }),
        section({ key: 'c', toggle: { key: 't2', label: { is: 'Tvo' } } }),
      ],
    })
    expect(toggles.map((toggle) => toggle.key)).toEqual(['t1', 't2'])
  })
})
