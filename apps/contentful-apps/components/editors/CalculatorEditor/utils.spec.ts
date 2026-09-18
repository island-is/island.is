import { calculatorConfigSchema } from '@island.is/tax-calculators'

import {
  filterConfigForPersistence,
  OUTPUT_TOTAL_SECTION_KEY,
  resolveIssuePath,
} from './utils'

const outputTotal = (extra = {}) => ({
  uid: 'hero',
  kind: 'value',
  key: 'total',
  label: { is: 'Samtals' },
  ...extra,
})

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
      outputTotal: outputTotal(),
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
      outputTotal: outputTotal(),
      inputSections: [
        inputSection('s1', [
          inputField('u1', 'income', { label: { is: '', en: 'Income' } }),
        ]),
      ],
      outputSections: [],
    } as never)

    expect(payload.inputSections[0].fields[0].label).toBeUndefined()
  })

  it('drops a content row whose markdown is whitespace only', () => {
    const { payload } = filterConfigForPersistence({
      outputTotal: outputTotal(),
      inputSections: [],
      outputSections: [
        {
          key: 'o1',
          fields: [
            { uid: 'c1', kind: 'content', content: { is: '  \n ', en: '' } },
            { uid: 'c2', kind: 'content', content: { is: 'Skýring' } },
          ],
        },
      ],
    } as never)

    expect(payload.outputSections[0].fields.map((f) => f.uid)).toEqual(['c2'])
  })

  it('drops an unlabelled toggle and any gate pointing at it', () => {
    const { payload } = filterConfigForPersistence({
      outputTotal: outputTotal(),
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
      outputTotal: outputTotal(),
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
      outputTotal: outputTotal(),
      inputSections: [],
      outputSections: [
        { key: 'o1', fields: [], variant: 'accordion', title: { is: '' } },
      ],
    } as never)

    expect(payload.outputSections[0].variant).toBeUndefined()
  })

  it('keeps an incomplete total rather than dropping it to a valid payload', () => {
    const { payload } = filterConfigForPersistence({
      outputTotal: outputTotal({ key: '', label: { is: '' } }),
      inputSections: [],
      outputSections: [],
    } as never)

    expect(payload.outputTotal.uid).toBe('hero')
    expect(calculatorConfigSchema.safeParse(payload)).toHaveProperty(
      'success',
      false,
    )
  })

  it('produces a payload the shared schema accepts', () => {
    const { payload } = filterConfigForPersistence({
      outputTotal: outputTotal(),
      inputSections: [
        inputSection('s1', [
          inputField('u1', ''),
          inputField('u2', 'income', { label: { is: '', en: 'x' } }),
        ]),
      ],
      outputSections: [
        {
          key: 'o1',
          fields: [{ uid: 'f1', kind: 'value', key: '', itemFields: [] }],
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
      outputTotal: outputTotal(),
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
      outputTotal: outputTotal(),
      inputSections: [],
      outputSections: [
        {
          key: 'o1',
          fields: [
            {
              uid: 'f1',
              kind: 'value',
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
      outputTotal: outputTotal(),
      inputSections: [],
      outputSections: [],
    } as never)

    expect(resolveIssuePath([], identity)).toBeUndefined()
  })

  it('resolves an issue on the total to the total row', () => {
    const { identity } = filterConfigForPersistence({
      outputTotal: outputTotal({ label: { is: '' } }),
      inputSections: [],
      outputSections: [],
    } as never)

    expect(resolveIssuePath(['outputTotal', 'label'], identity)).toEqual({
      tab: 'output',
      sectionKey: OUTPUT_TOTAL_SECTION_KEY,
      fieldUid: 'hero',
    })
  })
})
