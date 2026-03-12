import {
  FormSystemApplication,
  FormSystemScreen,
  FormSystemSection,
} from '@island.is/api/schema'
import {
  Action,
  ApplicationState,
  initializeField,
  SectionTypes,
} from '@island.is/form-system/ui'
import { hasScreens } from '../utils/reducerHelpers'
import {
  decrement,
  getDecrementVariables,
  getIncrementVariables,
  incrementWithoutScreens,
  incrementWithScreens,
  jumpToScreen,
  setCurrentScreen,
  setExternalServiceErrors,
} from './reducerUtils'

export const initialState = {
  application: {} as FormSystemApplication,
  sections: [],
  screens: [],
  currentSection: { data: {} as FormSystemSection, index: 0 },
  currentScreen: undefined,
  errors: [],
  screenError: {
    hasError: false,
    title: { is: '', en: '' },
    message: { is: '', en: '' },
  },
}

export const initialReducer = (state: ApplicationState): ApplicationState => {
  const application = initializeApplication(state.application)
  const sections: FormSystemSection[] = (application.sections ?? [])
    .filter((s): s is FormSystemSection => s != null)
    .sort(
      (a, b) =>
        (a.displayOrder ?? Number.MAX_SAFE_INTEGER) -
        (b.displayOrder ?? Number.MAX_SAFE_INTEGER),
    )
  const screens = sections
    .flatMap((section) => section.screens ?? [])
    .filter(Boolean) as FormSystemScreen[]

  if (application.hasPayment === false) {
    sections.forEach((s) => {
      if (s.sectionType === SectionTypes.PAYMENT) s.isHidden = true
    })
  } else {
    sections.forEach((s) => {
      if (s.sectionType === SectionTypes.PAYMENT) s.isHidden = false
    })
  }

  if (application.hasSummaryScreen === false) {
    sections.forEach((s) => {
      if (s.sectionType === SectionTypes.SUMMARY) s.isHidden = true
    })
  } else {
    sections.forEach((s) => {
      if (s.sectionType === SectionTypes.SUMMARY) s.isHidden = false
    })
  }

  const { currentSection, currentScreen } = getCurrentSectionAndScreen(sections)
  return {
    ...state,
    sections,
    screens,
    currentSection,
    currentScreen,
  }
}

const getCurrentSectionAndScreen = (sections: FormSystemSection[]) => {
  const currentSectionIndex = sections.findIndex(
    (section) => section.isCompleted === false && section.isHidden === false,
  )

  const currentSection = {
    data: sections[currentSectionIndex],
    index: currentSectionIndex,
  }

  if (currentSectionIndex < 1) {
    return {
      currentSection,
      currentScreen: undefined,
    }
  }

  const currentScreenIndex = currentSection.data.screens?.findIndex(
    (screen) => screen?.isCompleted === false && screen?.isHidden === false,
  )

  let currentScreen = undefined

  if (currentScreenIndex !== undefined) {
    currentScreen = {
      index: currentScreenIndex,
      data: currentSection.data.screens?.[
        currentScreenIndex
      ] as FormSystemScreen,
    }
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
      const { currentSectionData, currentScreenIndex } =
        getIncrementVariables(state)
      const { submitScreen, updateDependencies } = action.payload
      if (hasScreens(currentSectionData)) {
        return incrementWithScreens(
          state,
          currentSectionData,
          currentScreenIndex,
          submitScreen,
          updateDependencies,
        )
      }
      return incrementWithoutScreens(state, submitScreen)
    }
    case 'DECREMENT': {
      const { currentSectionIndex, currentScreenIndex } =
        getDecrementVariables(state)
      const { submitScreen, updateDependencies } = action.payload
      return decrement(
        state,
        currentSectionIndex,
        currentScreenIndex,
        submitScreen,
        updateDependencies,
      )
    }
    case 'INDEX_SCREEN': {
      const { sectionIndex, screenIndex, updateCompleted } = action.payload
      state = setCurrentScreen(state, sectionIndex, screenIndex)
      return jumpToScreen(state, sectionIndex, screenIndex, updateCompleted)
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

    case 'EXTERNAL_SERVICE_NOTIFICATION': {
      const { screen, isPopulateError } = action.payload
      return setExternalServiceErrors(state, screen, isPopulateError)
    }

    case 'SUBMITTED': {
      const { submitted, screenError } = action.payload
      return {
        ...state,
        submitted,
        screenError,
      }
    }
  }
}
