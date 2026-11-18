import { FormSystemSection } from '@island.is/api/schema'
import { ApplicationState, SectionTypes } from '@island.is/form-system/ui'
import { applicationReducer } from './applicationReducer'

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
