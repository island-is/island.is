import { FormSystemField, FormSystemSection } from '@island.is/api/schema'
import { SectionTypes } from '@island.is/form-system/enums'
import { ApplicationState, FieldTypesEnum } from '@island.is/form-system/ui'
import { setFieldValue } from './fieldReducerUtils'

jest.mock('@island.is/form-system/ui', () => ({
  FieldTypesEnum: {
    CHECKBOX: 'CHECKBOX',
    DROPDOWN_LIST: 'DROPDOWN_LIST',
    RADIO_BUTTONS: 'RADIO_BUTTONS',
    TEXTBOX: 'TEXTBOX',
  },
  SectionTypes: jest.requireActual('@island.is/form-system/enums').SectionTypes,
}))

const createField = (id: string, fieldType: string): FormSystemField => ({
  id,
  screenId: 'screen',
  name: { is: id, en: id },
  isPartOfMultiset: false,
  isRequired: false,
  fieldType,
  values: [0, 1].map((index) => ({
    id: `${id}-${index}`,
    json:
      fieldType === FieldTypesEnum.CHECKBOX
        ? { checkboxValue: true }
        : { label: { is: 'Selected', en: 'Selected' }, value: 'selected' },
  })),
  list: [{ id: `${id}-option`, label: { is: 'Selected', en: 'Selected' } }],
})

const createState = (
  fieldType: string,
  hiddenTarget: string,
): ApplicationState => {
  const sections: FormSystemSection[] = [
    {
      id: 'controls',
      sectionType: SectionTypes.INPUT,
      screens: [
        {
          id: 'controls-screen',
          sectionId: 'controls',
          fields: [createField('controller', FieldTypesEnum.CHECKBOX)],
        },
      ],
    },
    {
      id: 'section',
      sectionType: SectionTypes.INPUT,
      screens: [
        {
          id: 'screen',
          sectionId: 'section',
          fields: [
            createField('choice', fieldType),
            {
              ...createField('text', FieldTypesEnum.TEXTBOX),
              values: [{ id: 'text-value', json: { text: 'Keep this' } }],
            },
          ],
        },
      ],
    },
  ]

  return {
    application: {
      id: 'application',
      sections,
      dependencies: [
        {
          parentProp: 'controller',
          childProps: [hiddenTarget],
          isSelected: true,
        },
      ],
    },
    sections,
    screens: [],
    currentSection: { index: 0, data: sections[0] },
    currentScreen: { index: 0, data: sections[0].screens?.[0] ?? undefined },
    errors: [],
    screenError: {
      hasError: false,
      title: { is: '', en: '' },
      message: { is: '', en: '' },
    },
  }
}

const choiceField = (state: ApplicationState) =>
  state.sections[1].screens?.[0]?.fields?.[0]

describe.each([
  FieldTypesEnum.CHECKBOX,
  FieldTypesEnum.DROPDOWN_LIST,
  FieldTypesEnum.RADIO_BUTTONS,
])('hidden %s values', (fieldType) => {
  it.each(['choice', 'screen', 'section'])(
    'clears all selections when %s is hidden and leaves them cleared when shown',
    (hiddenTarget) => {
      const state = createState(fieldType, hiddenTarget)
      const hidden = setFieldValue(state, 'checkboxValue', 'controller', false)
      const resetJson =
        fieldType === FieldTypesEnum.CHECKBOX
          ? { checkboxValue: false }
          : { label: null, value: null }

      expect(choiceField(hidden)?.values).toEqual([
        { id: 'choice-0', json: resetJson },
        { id: 'choice-1', json: resetJson },
      ])
      expect(hidden.sections[1].screens?.[0]?.fields?.[1]?.values).toEqual([
        { id: 'text-value', json: { text: 'Keep this' } },
      ])
      expect(hidden.application.sections).toBe(hidden.sections)
      expect(hidden.currentScreen?.data).toBe(hidden.sections[0].screens?.[0])
      expect(choiceField(state)?.values?.[0]?.json).not.toEqual(resetJson)

      const shown = setFieldValue(hidden, 'checkboxValue', 'controller', true)
      expect(shown.sections[1].isHidden).toBe(false)
      expect(shown.sections[1].screens?.[0]?.isHidden).toBe(false)
      expect(choiceField(shown)?.isHidden).toBe(false)
      expect(choiceField(shown)?.values).toEqual(choiceField(hidden)?.values)
    },
  )

  it.each(['choice', 'screen', 'section'])(
    'turns off dependencies controlled by choices inside hidden %s',
    (hiddenTarget) => {
      const state = createState(fieldType, hiddenTarget)
      state.sections[0].screens?.[0]?.fields?.push(
        createField('dependent', FieldTypesEnum.CHECKBOX),
        createField('nested', FieldTypesEnum.DROPDOWN_LIST),
      )
      const parentProp =
        fieldType === FieldTypesEnum.CHECKBOX ? 'choice' : 'choice-option'
      state.application.dependencies?.push(
        { parentProp, childProps: ['dependent'], isSelected: true },
        { parentProp: 'dependent', childProps: ['nested'], isSelected: true },
      )

      const hidden = setFieldValue(state, 'checkboxValue', 'controller', false)
      expect(
        hidden.application.dependencies?.every((dep) => !dep?.isSelected),
      ).toBe(true)
      const fields = hidden.currentScreen?.data?.fields
      expect(fields?.find((field) => field?.id === 'dependent')).toMatchObject({
        isHidden: true,
        values: [
          { json: { checkboxValue: false } },
          { json: { checkboxValue: false } },
        ],
      })
      expect(fields?.find((field) => field?.id === 'nested')).toMatchObject({
        isHidden: true,
        values: [
          { json: { label: null, value: null } },
          { json: { label: null, value: null } },
        ],
      })
    },
  )

  it.each(['dependent-section', 'dependent-screen', 'dependent'])(
    'hides and resets downstream choices when a hidden choice controls %s',
    (dependentTarget) => {
      const state = createState(fieldType, 'choice')
      const parentProp =
        fieldType === FieldTypesEnum.CHECKBOX ? 'choice' : 'choice-option'
      state.sections.push({
        id: 'dependent-section',
        sectionType: SectionTypes.INPUT,
        screens: [
          {
            id: 'dependent-screen',
            sectionId: 'dependent-section',
            fields: [createField('dependent', fieldType)],
          },
        ],
      })
      state.sections[0].screens?.[0]?.fields?.push(
        createField('last', FieldTypesEnum.CHECKBOX),
      )
      const dependentParent =
        fieldType === FieldTypesEnum.CHECKBOX ? 'dependent' : 'dependent-option'
      state.application.dependencies?.push(
        { parentProp, childProps: [dependentTarget], isSelected: true },
        { parentProp: dependentParent, childProps: ['last'], isSelected: true },
      )

      const hidden = setFieldValue(state, 'checkboxValue', 'controller', false)
      const dependentSection = hidden.sections[2]
      const dependentScreen = dependentSection.screens?.[0]
      const dependentField = dependentScreen?.fields?.[0]
      const resetJson =
        fieldType === FieldTypesEnum.CHECKBOX
          ? { checkboxValue: false }
          : { label: null, value: null }

      expect(dependentSection.isHidden).toBe(
        dependentTarget === 'dependent-section',
      )
      expect(dependentScreen?.isHidden).toBe(dependentTarget !== 'dependent')
      expect(dependentField).toMatchObject({
        isHidden: true,
        values: [{ json: resetJson }, { json: resetJson }],
      })
      expect(
        hidden.currentScreen?.data?.fields?.find(
          (field) => field?.id === 'last',
        ),
      ).toMatchObject({
        isHidden: true,
        values: [
          { json: { checkboxValue: false } },
          { json: { checkboxValue: false } },
        ],
      })
      expect(
        hidden.application.dependencies?.every(
          (dependency) => !dependency?.isSelected,
        ),
      ).toBe(true)

      const shown = setFieldValue(hidden, 'checkboxValue', 'controller', true)
      expect(choiceField(shown)?.isHidden).toBe(false)
      expect(shown.sections[2].screens?.[0]?.fields?.[0]).toEqual(
        dependentField,
      )
      expect(
        shown.currentScreen?.data?.fields?.find(
          (field) => field?.id === 'last',
        ),
      ).toMatchObject({ isHidden: true })
    },
  )

  it('preserves choices and their dependencies when another parent keeps them visible', () => {
    const state = createState(fieldType, 'choice')
    const parentProp =
      fieldType === FieldTypesEnum.CHECKBOX ? 'choice' : 'choice-option'
    state.application.dependencies?.push(
      { parentProp: 'other', childProps: ['choice'], isSelected: true },
      { parentProp, childProps: ['text'], isSelected: true },
    )

    const updated = setFieldValue(state, 'checkboxValue', 'controller', false)
    expect(choiceField(updated)?.isHidden).toBe(false)
    expect(choiceField(updated)?.values).toEqual(choiceField(state)?.values)
    expect(
      updated.application.dependencies?.find(
        (dependency) => dependency?.parentProp === parentProp,
      )?.isSelected,
    ).toBe(true)
  })
})
