import { FormSystemField, FormSystemSection } from '@island.is/api/schema'
import {
  FieldTypesEnum,
  getHiddenMultisetFieldIds,
  SectionTypes,
} from '@island.is/form-system/shared'
import { describe, expect, it } from '@jest/globals'
import { applyDependencyVisibility } from './applyDependencyVisibility'

const field = (
  id: string,
  fieldType: string,
  overrides: Partial<FormSystemField> = {},
): FormSystemField => ({
  id,
  fieldType,
  screenId: 'screen',
  name: { is: id },
  isRequired: false,
  isPartOfMultiset: true,
  ...overrides,
})

const sectionsFor = (fields: FormSystemField[]): FormSystemSection[] => [
  {
    id: 'section',
    sectionType: SectionTypes.INPUT,
    screens: [{ id: 'screen', sectionId: 'section', isMulti: true, fields }],
  },
]

describe('multiset dependencies', () => {
  it('uses the matching row locally and any selected row for standalone and other-screen dependents', () => {
    const sections = sectionsFor([
      field('parent', FieldTypesEnum.CHECKBOX, {
        values: [
          { json: { checkboxValue: false } },
          { json: { checkboxValue: true } },
        ],
      }),
      field('local', FieldTypesEnum.TEXTBOX),
      field('standalone', FieldTypesEnum.TEXTBOX, { isPartOfMultiset: false }),
    ])
    sections[0].screens?.push({
      id: 'other-screen',
      sectionId: 'section',
      isMulti: true,
      fields: [field('external', FieldTypesEnum.TEXTBOX)],
    })
    const result = applyDependencyVisibility(sections, [
      { parentProp: 'parent', childProps: ['local', 'standalone', 'external'] },
    ])
    const screen = result.sections[0].screens?.[0]
    expect(result.dependencies[0].isSelected).toBe(true)
    expect(
      getHiddenMultisetFieldIds(screen ?? {}, result.dependencies, 0),
    ).toEqual(new Set(['local']))
    expect(
      getHiddenMultisetFieldIds(screen ?? {}, result.dependencies, 1),
    ).toEqual(new Set())
    expect(result.sections[0].screens?.[1]?.fields?.[0]?.isHidden).toBe(false)
  })

  it.each([FieldTypesEnum.RADIO_BUTTONS, FieldTypesEnum.DROPDOWN_LIST])(
    'matches %s option dependencies independently in each row, with OR visibility',
    (fieldType) => {
      const result = applyDependencyVisibility(
        sectionsFor([
          field('parent', fieldType, {
            list: [
              { id: 'yes', label: { is: 'Yes' } },
              { id: 'no', label: { is: 'No' } },
            ],
            values: [
              { json: { label: { is: 'Yes' } } },
              { json: { label: { is: 'No' } } },
            ],
          }),
          field('yes-child', FieldTypesEnum.TEXTBOX),
          field('no-child', FieldTypesEnum.TEXTBOX),
          field('either', FieldTypesEnum.TEXTBOX),
        ]),
        [
          { parentProp: 'yes', childProps: ['yes-child', 'either'] },
          { parentProp: 'no', childProps: ['no-child', 'either'] },
        ],
      )
      const screen = result.sections[0].screens?.[0] ?? {}
      expect(
        result.dependencies.map((dependency) => dependency.isSelected),
      ).toEqual([true, true])
      expect(getHiddenMultisetFieldIds(screen, result.dependencies, 0)).toEqual(
        new Set(['no-child']),
      )
      expect(getHiddenMultisetFieldIds(screen, result.dependencies, 1)).toEqual(
        new Set(['yes-child']),
      )
    },
  )

  it('clears only hidden row controllers and removes their downstream selection', () => {
    const sections = sectionsFor([
      field('parent', FieldTypesEnum.CHECKBOX, {
        values: [
          { json: { checkboxValue: true } },
          { json: { checkboxValue: false } },
        ],
      }),
      field('child', FieldTypesEnum.CHECKBOX, {
        values: [
          { id: 'visible', json: { checkboxValue: false } },
          { id: 'hidden', json: { checkboxValue: true } },
        ],
      }),
      field('nested', FieldTypesEnum.TEXTBOX),
      field('external', FieldTypesEnum.TEXTBOX, { isPartOfMultiset: false }),
    ])
    const result = applyDependencyVisibility(sections, [
      { parentProp: 'parent', childProps: ['child'], isSelected: true },
      {
        parentProp: 'child',
        childProps: ['nested', 'external'],
        isSelected: true,
      },
    ])
    const fields = result.sections[0].screens?.[0]?.fields
    expect(fields?.[1]?.values).toEqual([
      { id: 'visible', json: { checkboxValue: false } },
      { id: 'hidden', json: { checkboxValue: false } },
    ])
    expect(result.dependencies[1].isSelected).toBe(false)
    expect(fields?.[2]?.isHidden).toBe(true)
    expect(fields?.[3]?.isHidden).toBe(true)
    expect(
      sections[0].screens?.[0]?.fields?.[1]?.values?.[1]?.json?.checkboxValue,
    ).toBe(true)
  })

  it('preserves index-zero behavior for non-repeated controllers with extra stored values', () => {
    const sections = sectionsFor([
      field('parent', FieldTypesEnum.CHECKBOX, {
        isPartOfMultiset: false,
        values: [
          { json: { checkboxValue: false } },
          { json: { checkboxValue: true } },
        ],
      }),
      field('child', FieldTypesEnum.TEXTBOX),
    ])
    const result = applyDependencyVisibility(sections, [
      { parentProp: 'parent', childProps: ['child'], isSelected: true },
    ])
    expect(result.dependencies[0].isSelected).toBe(false)
    expect(result.sections[0].screens?.[0]?.fields?.[1]?.isHidden).toBe(true)
  })
})
