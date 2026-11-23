import { FormSystemSection } from '@island.is/api/schema'
import { ApplicationState, SectionTypes } from '@island.is/form-system/ui'
import {
  applicationReducer,
  uploadNavigationReducer,
} from './applicationReducer'

jest.mock('@island.is/form-system/ui', () => ({
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
