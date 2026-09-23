import {
  calculatorConfigSchema,
  collectInputFieldKeys,
  collectInputSectionToggles,
  collectOutputFieldKeys,
  collectOutputItemFieldKeys,
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

const itemField = (overrides = {}) => ({
  uid: 'i1',
  key: 'lowerBound',
  ...overrides,
})

const outputField = (overrides = {}) => ({
  uid: 'o1',
  kind: 'value' as const,
  key: 'totalChildBenefit',
  ...overrides,
})

const outputContent = (overrides = {}) => ({
  uid: 'oc1',
  kind: 'content' as const,
  content: { is: 'Athugið að útreikningur er til viðmiðunar.' },
  ...overrides,
})

const outputTotal = (overrides = {}) => ({
  uid: 'total',
  key: 'netSalary',
  label: { is: 'Heildarlaun eftir frádrátt' },
  ...overrides,
})

const outputSection = (overrides = {}) => ({
  key: 'os1',
  fields: [outputField()],
  ...overrides,
})

const config = (overrides = {}) => ({
  inputSections: [section()],
  outputTotal: outputTotal(),
  outputSections: [outputSection()],
  ...overrides,
})

describe('calculatorConfigSchema', () => {
  describe('root shape', () => {
    it('accepts a config with no sections at all', () => {
      const result = calculatorConfigSchema.safeParse({
        inputSections: [],
        outputTotal: outputTotal(),
        outputSections: [],
      })
      expect(result.success).toBe(true)
    })

    it('accepts a config with both input and output sections', () => {
      expect(calculatorConfigSchema.safeParse(config()).success).toBe(true)
    })

    it('strips keys it does not declare, on input and output sections alike', () => {
      const result = calculatorConfigSchema.safeParse(
        config({
          inputSections: [section({ somethingElse: 'dropped' })],
          outputSections: [outputSection({ somethingElse: 'dropped' })],
        }),
      )
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.inputSections[0]).not.toHaveProperty('somethingElse')
        expect(result.data.outputSections[0]).not.toHaveProperty(
          'somethingElse',
        )
      }
    })
  })

  describe('identity', () => {
    it('rejects an input field with no uid', () => {
      const { uid, ...withoutUid } = field()
      const result = calculatorConfigSchema.safeParse(
        config({ inputSections: [section({ fields: [withoutUid] })] }),
      )
      expect(result.success).toBe(false)
    })

    it('rejects a duplicate input field uid across sections', () => {
      const result = calculatorConfigSchema.safeParse(
        config({
          inputSections: [
            section({ key: 's1', fields: [field({ uid: 'dupe' })] }),
            section({
              key: 's2',
              fields: [field({ uid: 'dupe', key: 'other' })],
            }),
          ],
        }),
      )
      expect(result.success).toBe(false)
    })

    it('rejects a duplicate output field uid across sections', () => {
      const result = calculatorConfigSchema.safeParse(
        config({
          outputSections: [
            outputSection({
              key: 'os1',
              fields: [outputField({ uid: 'dupe' })],
            }),
            outputSection({
              key: 'os2',
              fields: [outputField({ uid: 'dupe' })],
            }),
          ],
        }),
      )
      expect(result.success).toBe(false)
    })

    it('rejects a duplicate input field key across sections', () => {
      const result = calculatorConfigSchema.safeParse(
        config({
          inputSections: [
            section({ key: 's1', fields: [field({ uid: 'a' })] }),
            section({ key: 's2', fields: [field({ uid: 'b' })] }),
          ],
        }),
      )
      expect(result.success).toBe(false)
    })

    /* An output value may legitimately appear twice; input keys may not. */
    it('accepts a repeated output field key across sections', () => {
      const result = calculatorConfigSchema.safeParse(
        config({
          outputSections: [
            outputSection({
              key: 'os1',
              fields: [outputField({ uid: 'a', variant: 'emphasis' })],
            }),
            outputSection({
              key: 'os2',
              fields: [outputField({ uid: 'b' })],
            }),
          ],
        }),
      )
      expect(result.success).toBe(true)
    })

    it('rejects a duplicate input section key', () => {
      const result = calculatorConfigSchema.safeParse(
        config({
          inputSections: [
            section({ key: 'same', fields: [field({ uid: 'a' })] }),
            section({
              key: 'same',
              fields: [field({ uid: 'b', key: 'other' })],
            }),
          ],
        }),
      )
      expect(result.success).toBe(false)
    })

    it('rejects a duplicate output section key', () => {
      const result = calculatorConfigSchema.safeParse(
        config({
          outputSections: [
            outputSection({ key: 'same', fields: [outputField({ uid: 'a' })] }),
            outputSection({ key: 'same', fields: [outputField({ uid: 'b' })] }),
          ],
        }),
      )
      expect(result.success).toBe(false)
    })

    it('rejects a duplicate item field uid within one output field', () => {
      const result = calculatorConfigSchema.safeParse(
        config({
          outputSections: [
            outputSection({
              fields: [
                outputField({
                  itemFields: [
                    itemField({ uid: 'dupe' }),
                    itemField({ uid: 'dupe', key: 'bracketNumber' }),
                  ],
                }),
              ],
            }),
          ],
        }),
      )
      expect(result.success).toBe(false)
    })

    it('rejects a duplicate item field key within one output field', () => {
      const result = calculatorConfigSchema.safeParse(
        config({
          outputSections: [
            outputSection({
              fields: [
                outputField({
                  itemFields: [
                    itemField({ uid: 'i1' }),
                    itemField({ uid: 'i2' }),
                  ],
                }),
              ],
            }),
          ],
        }),
      )
      expect(result.success).toBe(false)
    })

    it('accepts the same item field key under two different output fields', () => {
      const result = calculatorConfigSchema.safeParse(
        config({
          outputSections: [
            outputSection({
              fields: [
                outputField({
                  uid: 'o1',
                  key: 'taxBrackets',
                  itemFields: [itemField({ uid: 'i1' })],
                }),
                outputField({
                  uid: 'o2',
                  key: 'otherBrackets',
                  itemFields: [itemField({ uid: 'i2' })],
                }),
              ],
            }),
          ],
        }),
      )
      expect(result.success).toBe(true)
    })
  })

  describe('toggles and gates', () => {
    it('accepts a gate pointing at a toggle another section declares', () => {
      const result = calculatorConfigSchema.safeParse(
        config({
          inputSections: [
            section({
              key: 'owner',
              toggle: { key: 't1', label: { is: 'Kveikja' } },
              fields: [field({ uid: 'a' })],
            }),
            section({
              key: 'gated',
              gate: { toggle: 't1' },
              fields: [field({ uid: 'b', key: 'other' })],
            }),
          ],
        }),
      )
      expect(result.success).toBe(true)
    })

    /* An unresolved gate silently reads as "off" on the web side. */
    it('rejects a gate pointing at a toggle no section declares', () => {
      const result = calculatorConfigSchema.safeParse(
        config({ inputSections: [section({ gate: { toggle: 'ghost' } })] }),
      )
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual([
          'inputSections',
          0,
          'gate',
          'toggle',
        ])
      }
    })

    /* The switch that would reveal this section is rendered by the section it hides. */
    it('rejects a gate pointing at a toggle its own section declares', () => {
      const result = calculatorConfigSchema.safeParse(
        config({
          inputSections: [
            section({
              key: 'self',
              toggle: { key: 't1', label: { is: 'Kveikja' } },
              gate: { toggle: 't1' },
            }),
          ],
        }),
      )
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual([
          'inputSections',
          0,
          'gate',
          'toggle',
        ])
      }
    })

    it('rejects a gate left dangling by removing the section that owned it', () => {
      const withOwner = config({
        inputSections: [
          section({
            key: 'owner',
            toggle: { key: 't1', label: { is: 'Kveikja' } },
            fields: [field({ uid: 'a' })],
          }),
          section({
            key: 'gated',
            gate: { toggle: 't1' },
            fields: [field({ uid: 'b', key: 'other' })],
          }),
        ],
      })
      expect(calculatorConfigSchema.safeParse(withOwner).success).toBe(true)

      const ownerRemoved = {
        ...withOwner,
        inputSections: withOwner.inputSections.slice(1),
      }
      expect(calculatorConfigSchema.safeParse(ownerRemoved).success).toBe(false)
    })

    it('rejects two sections declaring the same toggle key', () => {
      const result = calculatorConfigSchema.safeParse(
        config({
          inputSections: [
            section({
              key: 's1',
              toggle: { key: 'same', label: { is: 'Eitt' } },
              fields: [field({ uid: 'a' })],
            }),
            section({
              key: 's2',
              toggle: { key: 'same', label: { is: 'Tvo' } },
              fields: [field({ uid: 'b', key: 'other' })],
            }),
          ],
        }),
      )
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual([
          'inputSections',
          1,
          'toggle',
          'key',
        ])
      }
    })
  })

  describe('outputTotal', () => {
    it('rejects a config with no total', () => {
      const { outputTotal: _omitted, ...withoutTotal } = config()
      expect(calculatorConfigSchema.safeParse(withoutTotal).success).toBe(false)
    })

    it('rejects a total with no label -- the label is the result heading', () => {
      const { label: _omitted, ...withoutLabel } = outputTotal()
      const result = calculatorConfigSchema.safeParse(
        config({ outputTotal: withoutLabel }),
      )
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['outputTotal', 'label'])
      }
    })

    it('rejects a total with no key', () => {
      expect(
        calculatorConfigSchema.safeParse(
          config({ outputTotal: outputTotal({ key: '' }) }),
        ).success,
      ).toBe(false)
    })

    it('rejects a section row reusing the total uid', () => {
      const result = calculatorConfigSchema.safeParse(
        config({
          outputTotal: outputTotal({ uid: 'shared' }),
          outputSections: [
            outputSection({ fields: [outputField({ uid: 'shared' })] }),
          ],
        }),
      )
      expect(result.success).toBe(false)
    })
  })

  describe('output presentation', () => {
    it('accepts an accordion section with a title', () => {
      const result = calculatorConfigSchema.safeParse(
        config({
          outputSections: [
            outputSection({
              variant: 'accordion',
              title: { is: 'Forsendur útreiknings' },
            }),
          ],
        }),
      )
      expect(result.success).toBe(true)
    })

    it('rejects an accordion section with no title', () => {
      const result = calculatorConfigSchema.safeParse(
        config({
          outputSections: [outputSection({ variant: 'accordion' })],
        }),
      )
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual([
          'outputSections',
          0,
          'title',
        ])
      }
    })

    it('accepts a default-variant section with no title', () => {
      const result = calculatorConfigSchema.safeParse(
        config({
          outputSections: [outputSection({ variant: 'default' })],
        }),
      )
      expect(result.success).toBe(true)
    })

    it('accepts a section holding only a content row', () => {
      const result = calculatorConfigSchema.safeParse(
        config({
          outputSections: [outputSection({ fields: [outputContent()] })],
        }),
      )
      expect(result.success).toBe(true)
    })

    it('accepts content interleaved between two value rows', () => {
      const result = calculatorConfigSchema.safeParse(
        config({
          outputSections: [
            outputSection({
              fields: [
                outputField({ uid: 'o1', key: 'taxBase' }),
                outputContent(),
                outputField({ uid: 'o2', key: 'totalChildBenefit' }),
              ],
            }),
          ],
        }),
      )
      expect(result.success).toBe(true)
    })

    it('rejects a row that is both a value and content', () => {
      const result = calculatorConfigSchema.safeParse(
        config({
          outputSections: [
            outputSection({
              fields: [outputField({ content: { is: 'Skýring' } })],
            }),
          ],
        }),
      )
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.outputSections[0].fields[0]).not.toHaveProperty(
          'content',
        )
      }
    })

    it('rejects a row with no kind', () => {
      const { kind, ...withoutKind } = outputField()
      const result = calculatorConfigSchema.safeParse(
        config({ outputSections: [outputSection({ fields: [withoutKind] })] }),
      )
      expect(result.success).toBe(false)
    })

    it('accepts a section with no fields at all', () => {
      const result = calculatorConfigSchema.safeParse(
        config({ outputSections: [outputSection({ fields: [] })] }),
      )
      expect(result.success).toBe(true)
    })
  })

  describe('localized text', () => {
    it('rejects an empty is string', () => {
      const result = calculatorConfigSchema.safeParse(
        config({
          inputSections: [section({ fields: [field({ label: { is: '' } })] })],
        }),
      )
      expect(result.success).toBe(false)
    })

    it('rejects an empty en string', () => {
      const result = calculatorConfigSchema.safeParse(
        config({
          inputSections: [
            section({ fields: [field({ label: { is: 'Tekjur', en: '' } })] }),
          ],
        }),
      )
      expect(result.success).toBe(false)
    })

    it('accepts is on its own', () => {
      const result = calculatorConfigSchema.safeParse(
        config({
          inputSections: [
            section({ fields: [field({ label: { is: 'Tekjur' } })] }),
          ],
        }),
      )
      expect(result.success).toBe(true)
    })

    it('rejects empty markdown content', () => {
      const result = calculatorConfigSchema.safeParse(
        config({
          outputSections: [
            outputSection({ fields: [outputContent({ content: { is: '' } })] }),
          ],
        }),
      )
      expect(result.success).toBe(false)
    })
  })

  describe('span', () => {
    it.each([0, 13, 1.5])('rejects %p', (span) => {
      const result = calculatorConfigSchema.safeParse(
        config({ inputSections: [section({ fields: [field({ span })] })] }),
      )
      expect(result.success).toBe(false)
    })
  })
})

describe('collectInputSectionToggles', () => {
  it('returns every declared toggle and nothing else', () => {
    const toggles = collectInputSectionToggles(
      config({
        inputSections: [
          section({ key: 'a', toggle: { key: 't1', label: { is: 'Eitt' } } }),
          section({ key: 'b' }),
          section({ key: 'c', toggle: { key: 't2', label: { is: 'Tvo' } } }),
        ],
      }),
    )
    expect(toggles.map((toggle) => toggle.key)).toEqual(['t1', 't2'])
  })
})

describe('collectInputFieldKeys', () => {
  it('returns keys in document order across sections', () => {
    const keys = collectInputFieldKeys(
      config({
        inputSections: [
          section({
            key: 'a',
            fields: [field({ uid: 'f1', key: 'income' })],
          }),
          section({
            key: 'b',
            fields: [
              field({ uid: 'f2', key: 'pension' }),
              field({ uid: 'f3', key: 'year' }),
            ],
          }),
        ],
      }),
    )
    expect(keys).toEqual(['income', 'pension', 'year'])
  })
})

describe('collectOutputFieldKeys', () => {
  it('dedupes a key placed in two sections, keeping first appearance order', () => {
    const keys = collectOutputFieldKeys(
      config({
        outputSections: [
          outputSection({
            key: 'os1',
            fields: [outputField({ uid: 'o1', key: 'total' })],
          }),
          outputSection({
            key: 'os2',
            fields: [
              outputField({ uid: 'o2', key: 'taxBase' }),
              outputField({ uid: 'o3', key: 'total' }),
            ],
          }),
        ],
      }),
    )
    expect(keys).toEqual(['netSalary', 'total', 'taxBase'])
  })

  it('leads with the total and dedupes it against a section placing the same key', () => {
    const keys = collectOutputFieldKeys(
      config({
        outputTotal: outputTotal({ key: 'total' }),
        outputSections: [
          outputSection({ fields: [outputField({ uid: 'o1', key: 'total' })] }),
        ],
      }),
    )
    expect(keys).toEqual(['total'])
  })

  it('ignores content rows, which carry no key', () => {
    const keys = collectOutputFieldKeys(
      config({
        outputSections: [
          outputSection({
            fields: [outputContent(), outputField({ key: 'taxBase' })],
          }),
        ],
      }),
    )
    expect(keys).toEqual(['netSalary', 'taxBase'])
  })
})

describe('collectOutputItemFieldKeys', () => {
  it('returns the item keys of an array output', () => {
    expect(
      collectOutputItemFieldKeys({
        uid: 'o1',
        kind: 'value' as const,
        key: 'taxBrackets',
        itemFields: [
          { uid: 'i1', key: 'lowerBound' },
          { uid: 'i2', key: 'bracketNumber' },
        ],
      }),
    ).toEqual(['lowerBound', 'bracketNumber'])
  })

  it('returns an empty list for a field with no itemFields', () => {
    expect(
      collectOutputItemFieldKeys({
        uid: 'o1',
        kind: 'value' as const,
        key: 'total',
      }),
    ).toEqual([])
  })
})
