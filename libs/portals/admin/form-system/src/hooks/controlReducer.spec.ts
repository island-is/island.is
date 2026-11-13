import { FormSystemField, FormSystemSection } from '@island.is/api/schema'
import { FieldTypesEnum, SectionTypes } from '@island.is/form-system/enums'
import { describe, expect, it, jest } from '@jest/globals'
import { ControlState, controlReducer } from './controlReducer'

const createState = (sections: FormSystemSection[] = []): ControlState => ({
  activeItem: { type: 'Section', data: undefined },
  activeListItem: null,
  form: {
    id: 'form',
    name: { is: '' },
    status: 'IN_DEVELOPMENT',
    created: '2026-01-01T00:00:00Z',
    modified: '2026-01-01T00:00:00Z',
    allowProceedOnValidationFail: false,
    draftDaysToLive: 0,
    enableApplicationPdfDownload: false,
    hasSummaryScreen: false,
    isInaccessible: false,
    isTranslated: false,
    submissionDaysToLive: 0,
    validateEligibility: false,
    sections,
  },
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

describe('currency sum selection cleanup', () => {
  const createField = (field: Partial<FormSystemField>): FormSystemField => ({
    id: 'field',
    name: { is: '' },
    screenId: 'screen',
    isRequired: false,
    isPartOfMultiset: false,
    fieldType: FieldTypesEnum.ISK_NUMBERBOX,
    ...field,
  })

  const setup = () => {
    const currency = createField({ id: 'currency' })
    const sum = createField({
      id: 'sum',
      fieldType: FieldTypesEnum.ISK_SUMBOX,
      fieldSettings: {
        fieldsToSum: ['currency', 'other'],
        zendeskCustomFieldId: 'custom',
      },
    })
    const lastMemberSum = createField({
      id: 'last-member-sum',
      fieldType: FieldTypesEnum.ISK_SUMBOX,
      fieldSettings: { fieldsToSum: ['currency'] },
    })
    const defaultSum = createField({
      id: 'default-sum',
      fieldType: FieldTypesEnum.ISK_SUMBOX,
      fieldSettings: { fieldsToSum: null },
    })
    const initialState = createState()
    const state: ControlState = {
      ...initialState,
      activeItem: { type: 'Field', data: currency },
      form: {
        ...initialState.form,
        fields: [currency, sum, lastMemberSum, defaultSum],
        dependencies: [],
      },
    }
    return { state, currency, sum, defaultSum }
  }

  it.each([false, true])(
    'removes deleted currency IDs with skipActiveItem=%s',
    (skipActiveItem) => {
      const { state, sum, defaultSum } = setup()
      const update = jest.fn()
      if (skipActiveItem) state.activeItem = { type: 'Field', data: sum }

      const result = controlReducer(state, {
        type: 'REMOVE_FIELD',
        payload: { id: 'currency', skipActiveItem, update },
      })

      expect(result.form.fields?.map((field) => field?.id)).toEqual([
        'sum',
        'last-member-sum',
        'default-sum',
      ])
      expect(result.form.fields?.[0]?.fieldSettings).toEqual({
        fieldsToSum: ['other'],
        zendeskCustomFieldId: 'custom',
      })
      expect(result.form.fields?.[1]?.fieldSettings?.fieldsToSum).toEqual([])
      expect(result.form.fields?.[2]).toBe(defaultSum)
      expect(sum.fieldSettings?.fieldsToSum).toEqual(['currency', 'other'])
      expect(update).toHaveBeenCalledTimes(2)
      expect(update).toHaveBeenCalledWith({
        type: 'Field',
        data: result.form.fields?.[0],
      })
      expect(update).toHaveBeenCalledWith({
        type: 'Field',
        data: result.form.fields?.[1],
      })
      if (skipActiveItem) {
        expect(result.activeItem.data).toBe(result.form.fields?.[0])
      } else {
        expect(result.activeItem.type).toBe('Screen')
      }
    },
  )

  it.each([FieldTypesEnum.TEXTBOX, FieldTypesEnum.ISK_NUMBERBOX])(
    'cleans sum selections only when currency fields change away to %s',
    (newValue) => {
      const { state, sum, defaultSum } = setup()
      const update = jest.fn()

      const result = controlReducer(state, {
        type: 'CHANGE_FIELD_TYPE',
        payload: { newValue, fieldSettings: {}, update },
      })

      expect(result.activeItem.data).toEqual(
        expect.objectContaining({ id: 'currency', fieldType: newValue }),
      )
      expect(result.form.fields?.[0]).toBe(result.activeItem.data)
      expect(result.form.fields?.[1]?.fieldSettings?.fieldsToSum).toEqual(
        newValue === FieldTypesEnum.ISK_NUMBERBOX
          ? ['currency', 'other']
          : ['other'],
      )
      expect(result.form.fields?.[2]?.fieldSettings?.fieldsToSum).toEqual(
        newValue === FieldTypesEnum.ISK_NUMBERBOX ? ['currency'] : [],
      )
      expect(result.form.fields?.[3]).toBe(defaultSum)
      expect(sum.fieldSettings?.fieldsToSum).toEqual(['currency', 'other'])
      expect(update).toHaveBeenCalledWith(result.activeItem)
      if (newValue !== FieldTypesEnum.ISK_NUMBERBOX) {
        expect(update).toHaveBeenCalledWith({
          type: 'Field',
          data: result.form.fields?.[1],
        })
        expect(update).toHaveBeenCalledWith({
          type: 'Field',
          data: result.form.fields?.[2],
        })
        expect(update).toHaveBeenCalledTimes(3)
      } else {
        expect(update).toHaveBeenCalledTimes(1)
      }
    },
  )
})
