import { calculatorConfigSchema } from '@island.is/tax-calculators'

import { filterConfigForPersistence, resolveIssuePath } from './utils'

const inputField = (uid: string, key: string, extra = {}) => ({
  uid,
  key,
  span: 12,
  ...extra,
})

const inputSection = (key: string, fields: unknown[], extra = {}) => ({
  key,
  fields,
  ...extra,
})

describe('filterConfigForPersistence', () => {
  it('drops draft rows but keeps complete ones', () => {
    const { payload } = filterConfigForPersistence({
      inputSections: [
        inputSection('s1', [
          inputField('u1', ''),
          inputField('u2', 'income'),
          inputField('u3', ''),
        ]),
      ],
      outputSections: [],
    } as never)

    expect(payload.inputSections[0].fields.map((f) => f.uid)).toEqual(['u2'])
  })

  it('omits a localized value whose Icelandic half is empty', () => {
    const { payload } = filterConfigForPersistence({
      inputSections: [
        inputSection('s1', [
          inputField('u1', 'income', { label: { is: '', en: 'Income' } }),
        ]),
      ],
      outputSections: [],
    } as never)

    expect(payload.inputSections[0].fields[0].label).toBeUndefined()
  })

  it('treats whitespace-only markdown as empty', () => {
    const { payload } = filterConfigForPersistence({
      inputSections: [],
      outputSections: [
        { key: 'o1', fields: [], content: { is: '  \n ', en: '' } },
      ],
    } as never)

    expect(payload.outputSections[0].content).toBeUndefined()
  })

  it('drops an unlabelled toggle and any gate pointing at it', () => {
    const { payload } = filterConfigForPersistence({
      inputSections: [
        inputSection('s1', [], { toggle: { key: 't1', label: { is: '' } } }),
        inputSection('s2', [], { gate: { toggle: 't1' } }),
      ],
      outputSections: [],
    } as never)

    expect(payload.inputSections[0].toggle).toBeUndefined()
    expect(payload.inputSections[1].gate).toBeUndefined()
  })

  it('keeps a labelled toggle and the gate referencing it', () => {
    const { payload } = filterConfigForPersistence({
      inputSections: [
        inputSection('s1', [], { toggle: { key: 't1', label: { is: 'On' } } }),
        inputSection('s2', [], { gate: { toggle: 't1' } }),
      ],
      outputSections: [],
    } as never)

    expect(payload.inputSections[0].toggle?.key).toBe('t1')
    expect(payload.inputSections[1].gate?.toggle).toBe('t1')
  })

  it('drops an accordion variant when the title is not persistable', () => {
    const { payload } = filterConfigForPersistence({
      inputSections: [],
      outputSections: [
        { key: 'o1', fields: [], variant: 'accordion', title: { is: '' } },
      ],
    } as never)

    expect(payload.outputSections[0].variant).toBeUndefined()
  })

  it('passes unknown-to-the-filter schema keys through untouched', () => {
    const { payload } = filterConfigForPersistence({
      inputSections: [],
      outputSections: [{ key: 'o1', fields: [], divider: 'before' }],
    } as never)

    expect(payload.outputSections[0].divider).toBe('before')
  })

  it('produces a payload the shared schema accepts', () => {
    const { payload } = filterConfigForPersistence({
      inputSections: [
        inputSection('s1', [
          inputField('u1', ''),
          inputField('u2', 'income', { label: { is: '', en: 'x' } }),
        ]),
      ],
      outputSections: [
        {
          key: 'o1',
          fields: [{ uid: 'f1', key: '', itemFields: [] }],
          variant: 'accordion',
        },
      ],
    } as never)

    expect(calculatorConfigSchema.safeParse(payload)).toHaveProperty(
      'success',
      true,
    )
  })
})

describe('resolveIssuePath', () => {
  /* The regression this exists for: a draft row earlier in the list shifts
   * every later payload index, so resolving by position alone points the error
   * at the wrong row. */
  it('resolves a payload index back to the row that owns it', () => {
    const { identity } = filterConfigForPersistence({
      inputSections: [
        inputSection('s1', [
          inputField('draft', ''),
          inputField('real', 'income'),
        ]),
      ],
      outputSections: [],
    } as never)

    expect(resolveIssuePath(['inputSections', 0, 'fields', 0], identity)).toEqual(
      { tab: 'input', sectionKey: 's1', fieldUid: 'real' },
    )
  })

  it('resolves a nested property path to its owning row', () => {
    const { identity } = filterConfigForPersistence({
      inputSections: [inputSection('s1', [inputField('u1', 'income')])],
      outputSections: [],
    } as never)

    expect(
      resolveIssuePath(['inputSections', 0, 'fields', 0, 'key'], identity),
    ).toEqual({ tab: 'input', sectionKey: 's1', fieldUid: 'u1' })
  })

  it('resolves an output item row three levels deep', () => {
    const { identity } = filterConfigForPersistence({
      inputSections: [],
      outputSections: [
        {
          key: 'o1',
          fields: [
            {
              uid: 'f1',
              key: 'rows',
              itemFields: [
                { uid: 'i-draft', key: '' },
                { uid: 'i-real', key: 'amount' },
              ],
            },
          ],
        },
      ],
    } as never)

    expect(
      resolveIssuePath(
        ['outputSections', 0, 'fields', 0, 'itemFields', 0, 'uid'],
        identity,
      ),
    ).toEqual({
      tab: 'output',
      sectionKey: 'o1',
      fieldUid: 'f1',
      itemUid: 'i-real',
    })
  })

  it('falls back to the section when no row matches', () => {
    const { identity } = filterConfigForPersistence({
      inputSections: [inputSection('s1', [])],
      outputSections: [],
    } as never)

    expect(resolveIssuePath(['inputSections', 0, 'key'], identity)).toEqual({
      tab: 'input',
      sectionKey: 's1',
    })
  })

  it('returns undefined for a root-level issue', () => {
    const { identity } = filterConfigForPersistence({
      inputSections: [],
      outputSections: [],
    } as never)

    expect(resolveIssuePath([], identity)).toBeUndefined()
  })
})
