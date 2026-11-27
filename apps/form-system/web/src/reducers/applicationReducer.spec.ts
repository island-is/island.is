import { FormSystemSection } from '@island.is/api/schema'
import { ApplicationState, SectionTypes } from '@island.is/form-system/ui'
import { FieldTypesEnum } from '@island.is/form-system/enums'
import {
  applicationReducer,
  initialReducer,
  uploadNavigationReducer,
} from './applicationReducer'

jest.mock('@island.is/form-system/ui', () => ({
  ...jest.requireActual(
    '../../../../../libs/portals/form-system/ui-components/src/lib/fieldTypes',
  ),
  FieldTypesEnum: jest.requireActual('@island.is/form-system/enums')
    .FieldTypesEnum,
  applyDependencyVisibility: jest.requireActual(
    '../../../../../libs/portals/form-system/ui-components/src/lib/applyDependencyVisibility',
  ).applyDependencyVisibility,
  SectionTypes: jest.requireActual('@island.is/form-system/enums').SectionTypes,
}))

const createState = (): ApplicationState => {
  const section: FormSystemSection = {
    id: 'section',
    sectionType: SectionTypes.INPUT,
    isHidden: false,
    screens: [0, 1, 2].map((index) => ({
      id: `screen-${index}`,
      sectionId: 'section',
      isHidden: false,
    })),
  }
  return {
    application: { id: 'application' },
    sections: [section],
    screens: [],
    currentSection: { index: 0, data: section },
    currentScreen: { index: 1, data: section.screens?.[1] ?? undefined },
  }
}

it('recalculates dependencies on reopening and when the last selected multiset row is removed', () => {
  const state = createState()
  const screen = state.currentScreen?.data
  if (!screen) throw new Error('Missing screen fixture')
  screen.isMulti = true
  screen.fields = [
    {
      id: 'parent',
      screenId: screen.id,
      name: { is: 'Parent' },
      isRequired: false,
      isPartOfMultiset: true,
      fieldType: FieldTypesEnum.CHECKBOX,
      values: [
        { json: { checkboxValue: false } },
        { json: { checkboxValue: true } },
      ],
    },
    {
      id: 'external',
      screenId: screen.id,
      name: { is: 'External' },
      isRequired: false,
      isPartOfMultiset: false,
      fieldType: FieldTypesEnum.TEXTBOX,
    },
  ]
  state.application.dependencies = [
    { parentProp: 'parent', childProps: ['external'], isSelected: true },
  ]
  const reopened = initialReducer({
    ...state,
    application: {
      ...state.application,
      sections: state.sections,
      dependencies: [
        { parentProp: 'parent', childProps: ['external'], isSelected: false },
      ],
    },
  })
  expect(reopened.application.dependencies?.[0]?.isSelected).toBe(true)
  expect(reopened.sections[0].screens?.[1]?.fields?.[1]?.isHidden).toBe(false)

  const result = applicationReducer(state, { type: 'REMOVE_MULTISET_ITEM' })
  expect(result.application.dependencies?.[0]?.isSelected).toBe(false)
  expect(result.currentScreen?.data?.fields?.[0]?.values).toHaveLength(1)
  expect(result.currentScreen?.data?.fields?.[1]?.isHidden).toBe(true)
  expect(result.currentScreen?.data).toBe(result.sections[0].screens?.[1])
})

it.each([
  { type: 'INCREMENT', expectedIndex: 2 },
  { type: 'DECREMENT', expectedIndex: 0 },
  {
    type: 'INDEX_SCREEN',
    payload: {
      sectionIndex: 0,
      screenIndex: 0,
      updateCompleted: [jest.fn().mockResolvedValue({}), {}],
    },
    expectedIndex: 0,
  },
])(
  'blocks $type until every upload finishes',
  ({ expectedIndex, ...action }) => {
    let state = createState()
    state = applicationReducer(state, { type: 'START_FILE_UPLOAD' })
    state = applicationReducer(state, { type: 'START_FILE_UPLOAD' })
    expect(applicationReducer(state, action)).toBe(state)

    state = applicationReducer(state, { type: 'FINISH_FILE_UPLOAD' })
    expect(applicationReducer(state, action)).toBe(state)

    state = applicationReducer(state, { type: 'FINISH_FILE_UPLOAD' })
    expect(applicationReducer(state, action).currentScreen?.index).toBe(
      expectedIndex,
    )
  },
)

it('rejects navigation reservations while uploading and upload starts while navigating', () => {
  let state = createState()
  state = applicationReducer(state, { type: 'START_FILE_UPLOAD' })
  expect(applicationReducer(state, { type: 'START_NAVIGATION' })).toBe(state)
  expect(applicationReducer(state, { type: 'INCREMENT' })).toBe(state)

  state = applicationReducer(state, { type: 'FINISH_FILE_UPLOAD' })
  state = applicationReducer(state, { type: 'START_NAVIGATION' })
  expect(state.isNavigating).toBe(true)
  expect(applicationReducer(state, { type: 'START_FILE_UPLOAD' })).toBe(state)

  state = applicationReducer(state, { type: 'FINISH_NAVIGATION' })
  expect(
    applicationReducer(state, { type: 'START_FILE_UPLOAD' }).pendingUploads,
  ).toBe(1)
})

it('blocks forward navigation until every field finishes loading without blocking back', () => {
  let state = createState()
  const setLoading = (id: string, loading: boolean) => {
    state = applicationReducer(state, {
      type: 'SET_FIELD_LOADING',
      payload: { id, loading },
    })
  }
  setLoading('children-1', true)
  setLoading('children-1', true)
  setLoading('children-2', true)
  expect(applicationReducer(state, { type: 'INCREMENT' })).toBe(state)
  expect(
    applicationReducer(state, { type: 'DECREMENT' }).currentScreen?.index,
  ).toBe(0)

  setLoading('children-1', false)
  expect(applicationReducer(state, { type: 'INCREMENT' })).toBe(state)

  setLoading('children-2', false)
  expect(
    applicationReducer(state, { type: 'INCREMENT' }).currentScreen?.index,
  ).toBe(2)
})

it('keeps uploads blocked after successful submission even when navigation finishes', () => {
  let state = uploadNavigationReducer(createState(), {
    type: 'START_NAVIGATION',
  })
  state = uploadNavigationReducer(state, {
    type: 'SUBMITTED',
    payload: { submitted: true },
  })
  state = uploadNavigationReducer(state, { type: 'FINISH_NAVIGATION' })
  expect(uploadNavigationReducer(state, { type: 'START_FILE_UPLOAD' })).toBe(
    state,
  )
})
