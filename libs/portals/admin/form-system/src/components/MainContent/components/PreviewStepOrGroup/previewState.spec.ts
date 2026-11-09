import { FormSystemForm } from '@island.is/api/schema'
import { FieldTypesEnum, SectionTypes } from '@island.is/form-system/enums'
import {
  createPreviewState,
  getPreviewSections,
  getPreviewSteps,
  getRestrictedPreviewStart,
  updateRestrictedPreview,
} from './previewState'

const form = {
  sections: [
    { id: 'applicants', sectionType: SectionTypes.PARTIES },
    { id: 'input', sectionType: SectionTypes.INPUT },
  ],
  screens: [
    { id: 'applicant-screen', sectionId: 'applicants' },
    { id: 'first', sectionId: 'input' },
    { id: 'dependent-screen', sectionId: 'input' },
  ],
  fields: [
    { id: 'parent', screenId: 'first', fieldType: FieldTypesEnum.CHECKBOX },
    {
      id: 'child',
      screenId: 'dependent-screen',
      fieldType: FieldTypesEnum.CHECKBOX,
    },
    { id: 'grandchild', screenId: 'first', fieldType: FieldTypesEnum.TEXTBOX },
  ],
  dependencies: [
    {
      parentProp: 'parent',
      childProps: ['dependent-screen'],
      isSelected: false,
    },
    { parentProp: 'child', childProps: ['grandchild'], isSelected: false },
  ],
} as unknown as FormSystemForm

it('starts after applicants and skips hidden dependent screens', () => {
  const state = createPreviewState(form)
  const steps = getPreviewSteps(getPreviewSections(state, true))
  expect(steps.map((step) => step.screen?.id)).toEqual([
    'applicant-screen',
    'first',
  ])
  expect(getRestrictedPreviewStart(steps)).toBe(1)
  expect(getPreviewSteps(getPreviewSections(state, false))).toHaveLength(3)
})

it('tracks selections and clears hidden controllers and their cascading dependencies', () => {
  let state = createPreviewState(form)
  state = updateRestrictedPreview(state, {
    type: 'SET_CHECKBOX_VALUE',
    payload: { id: 'parent', value: true },
  })
  expect(getPreviewSteps(getPreviewSections(state, true))).toHaveLength(3)
  state = updateRestrictedPreview(state, {
    type: 'SET_CHECKBOX_VALUE',
    payload: { id: 'child', value: true },
  })
  expect(state.dependencies.every((dependency) => dependency.isSelected)).toBe(
    true,
  )
  state = updateRestrictedPreview(state, {
    type: 'SET_CHECKBOX_VALUE',
    payload: { id: 'parent', value: false },
  })
  expect(state.dependencies.every((dependency) => !dependency.isSelected)).toBe(
    true,
  )
  expect(
    state.fields.find((field) => field.id === 'child')?.values?.[0]?.json
      ?.checkboxValue,
  ).toBe(false)
  expect(form.dependencies?.[0]?.isSelected).toBe(false)
})

it('selects list-option dependencies and uses OR visibility for multiple parents', () => {
  const state = createPreviewState({
    ...form,
    fields: [
      {
        id: 'list',
        screenId: 'first',
        fieldType: FieldTypesEnum.RADIO_BUTTONS,
        list: [
          { id: 'yes', label: { is: 'Já' } },
          { id: 'no', label: { is: 'Nei' } },
        ],
      },
    ],
    dependencies: [
      {
        parentProp: 'yes',
        childProps: ['dependent-screen'],
        isSelected: false,
      },
      { parentProp: 'no', childProps: ['dependent-screen'], isSelected: false },
    ],
  })
  const next = updateRestrictedPreview(state, {
    type: 'SET_LIST_VALUE',
    payload: { id: 'list', value: { label: { is: 'Já' }, value: 'yes' } },
  })
  expect(next.dependencies.map((dependency) => dependency.isSelected)).toEqual([
    true,
    false,
  ])
  expect(getPreviewSteps(getPreviewSections(next, true))).toHaveLength(3)
})
