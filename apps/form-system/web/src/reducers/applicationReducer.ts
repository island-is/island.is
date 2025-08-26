import {
  FormSystemApplication,
  FormSystemScreen,
  FormSystemSection,
} from '@island.is/api/schema'
import {
  Action,
  ApplicationState,
  initializeField,
} from '@island.is/form-system/ui'
import {
  decrementWithoutScreens,
  decrementWithScreens,
  getDecrementVariables,
  getIncrementVariables,
  incrementWithoutScreens,
  incrementWithScreens,
} from './reducerUtils'
import { hasScreens } from '../utils/reducerHelpers'

export const initialState = {
  application: {} as FormSystemApplication,
  sections: [],
  screens: [],
  currentSection: { data: {} as FormSystemSection, index: 0 },
  currentScreen: undefined,
  errors: [],
}

export const initialReducer = (state: ApplicationState): ApplicationState => {
  const application = initializeApplication(state.application)
  const sections = (application.sections ?? []).filter(
    Boolean,
  ) as FormSystemSection[]
  const screens = sections
    .flatMap((section) => section.screens ?? [])
    .filter(Boolean) as FormSystemScreen[]

  const { currentSection, currentScreen } = getCurrentSectionAndScreen(
    sections,
    screens,
  )

  // Arrange sections such that sectionType.PAYMENT is second last and sectionType.SUMMARY is last
  sections.sort((a, b) => {
    if (a.sectionType === 'SUMMARY') return 1
    if (b.sectionType === 'SUMMARY') return -1
    if (a.sectionType === 'PAYMENT') return 1
    if (b.sectionType === 'PAYMENT') return -1
    return 0
  })

  return {
    ...state,
    sections,
    screens,
    currentSection,
    currentScreen,
  }
}

const getCurrentSectionAndScreen = (
  sections: FormSystemSection[],
  screens: FormSystemScreen[],
) => {
  const currentSectionIndex = sections.findIndex(
    (section) => section.isCompleted === false,
  )
  const currentSection = {
    data: sections[currentSectionIndex],
    index: currentSectionIndex,
  }

  if (currentSectionIndex < 2) {
    return {
      currentSection,
      currentScreen: undefined,
    }
  }

  const currentScreenIndex = screens.findIndex(
    (screen) => screen.isCompleted === false,
  )
  const currentScreen = {
    data: screens[currentScreenIndex],
    index: currentScreenIndex,
  }

  return {
    currentSection,
    currentScreen,
  }
}

const initializeApplication = (
  application: FormSystemApplication,
): FormSystemApplication => {
  return {
    ...application,
    sections: application.sections?.map((section) => ({
      ...section,
      screens: section?.screens?.map((screen) => ({
        ...screen,
        fields: screen?.fields
          ?.filter(
            (field): field is Exclude<typeof field, null> => field !== null,
          )
          .map((field) => initializeField(field)),
      })),
    })) as FormSystemSection[],
  }
}

export const applicationReducer = (
  state: ApplicationState,
  action: Action,
): ApplicationState => {
  switch (action.type) {
    case 'INCREMENT': {
      const { submitScreen, submitSection } = action.payload
      const { currentSectionData, currentScreenIndex } =
        getIncrementVariables(state)
      if (hasScreens(currentSectionData)) {
        return incrementWithScreens(
          state,
          currentSectionData,
          currentScreenIndex,
          submitScreen,
        )
      }
      return incrementWithoutScreens(state, submitSection)
    }
    case 'DECREMENT': {
      const { currentSectionData, currentSectionIndex, currentScreenIndex } =
        getDecrementVariables(state)
      if (hasScreens(currentSectionData)) {
        return decrementWithScreens(
          state,
          currentSectionIndex,
          currentScreenIndex,
        )
      }

      return decrementWithoutScreens(state, currentSectionIndex)
    }
    case 'SET_VALIDITY': {
      const { isValid } = action.payload
      return {
        ...state,
        isValid,
      }
    }
    default:
      return state
  }
}
