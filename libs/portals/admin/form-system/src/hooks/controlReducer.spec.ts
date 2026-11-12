import { FormSystemSection } from '@island.is/api/schema'
import { SectionTypes } from '@island.is/form-system/enums'
import { ControlState, controlReducer } from './controlReducer'

const createState = (sections: FormSystemSection[] = []): ControlState => ({
  activeItem: { type: 'Section', data: undefined },
  activeListItem: null,
  form: { sections },
  organizationNationalId: null,
  isReadOnly: false,
})

describe('ADD_SECTION', () => {
  it('inserts before summary and preserves the surrounding sections', () => {
    const state = createState([
      { id: 'parties', sectionType: SectionTypes.PARTIES, displayOrder: 0 },
      { id: 'input', sectionType: SectionTypes.INPUT, displayOrder: 1 },
      { id: 'summary', sectionType: SectionTypes.SUMMARY, displayOrder: 2 },
      { id: 'payment', sectionType: SectionTypes.INPUT, displayOrder: 3 },
    ])

    const result = controlReducer(state, {
      type: 'ADD_SECTION',
      payload: { section: { id: 'new', displayOrder: 4 } },
    })

    expect(result.form.sections?.map((section) => section?.id)).toEqual([
      'parties',
      'input',
      'new',
      'summary',
      'payment',
    ])
    expect(
      result.form.sections?.map((section) => section?.displayOrder),
    ).toEqual([0, 1, 2, 3, 4])
    expect(result.activeItem).toEqual({
      type: 'Section',
      data: { id: 'new', displayOrder: 2, sectionType: SectionTypes.INPUT },
    })
    expect(state.form.sections?.[2]?.displayOrder).toBe(2)
    expect(state.form.sections).toHaveLength(4)
  })

  it('appends when there is no summary', () => {
    const result = controlReducer(
      createState([{ id: 'input', sectionType: SectionTypes.INPUT }]),
      { type: 'ADD_SECTION', payload: { section: { id: 'new' } } },
    )

    expect(result.form.sections?.map((section) => section?.id)).toEqual([
      'input',
      'new',
    ])
    expect(result.activeItem.data?.displayOrder).toBe(1)
  })

  it('adds the first section to an empty form', () => {
    const result = controlReducer(createState(), {
      type: 'ADD_SECTION',
      payload: { section: { id: 'new' } },
    })

    expect(result.form.sections).toEqual([
      { id: 'new', displayOrder: 0, sectionType: SectionTypes.INPUT },
    ])
  })
})
