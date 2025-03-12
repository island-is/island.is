import { FormSystemApplication, FormSystemScreen, FormSystemSection } from "@island.is/api/schema"
import { SectionTypes, Action, ApplicationState, initializeField } from "@island.is/form-system/ui"
import { decrementWithoutScreens, decrementWithScreens, getDecrementVariables, getIncrementVariables, hasScreens, incrementWithoutScreens, incrementWithScreens } from "./reducerUtils"


export const initialReducer = (
  state: ApplicationState
): ApplicationState => {
  const application = initializeApplication(state.application)
  const { completed } = application
  //TODO: need to implement logic on getting current section and screen when loading the application
  const section = application.sections && application.sections[0] ? application.sections[0] : null

  const sections = (application.sections ?? []).filter(Boolean) as FormSystemSection[]

  const screens = sections.flatMap(section => section.screens ?? []).filter(Boolean) as FormSystemScreen[]

  // Move payment to the end, should get fixed in the backend
  const paymentIndex = sections.findIndex(section => section.sectionType === SectionTypes.PAYMENT)
  if (paymentIndex !== -1) {
    const payment = sections.splice(paymentIndex, 1)
    sections.push(payment[0])
  }
  return {
    ...state,
    sections,
    screens,
    currentSection: {
      data: section ?? {} as FormSystemSection,
      index: 0
    },
  }
}

const initializeApplication = (application: FormSystemApplication): FormSystemApplication => {
  return {
    ...application,
    sections: application.sections?.map(section => ({
      ...section,
      screens: section?.screens?.map(screen => ({
        ...screen,
        fields: screen?.fields?.filter((field): field is Exclude<typeof field, null> => field !== null).map(field => initializeField(field))
      }))
    })) as FormSystemSection[]
  }
}

export const applicationReducer = (
  state: ApplicationState,
  action: Action
): ApplicationState => {
  switch (action.type) {
    case 'INCREMENT': {
      const { currentSectionData, maxSectionIndex, nextSectionIndex, currentScreenIndex } =
        getIncrementVariables(state)

      if (hasScreens(currentSectionData)) {
        return incrementWithScreens(state, currentSectionData, maxSectionIndex, currentScreenIndex)
      }

      return incrementWithoutScreens(state, nextSectionIndex)
    }
    case 'DECREMENT': {
      const { currentSectionData, currentSectionIndex, currentScreenIndex } =
        getDecrementVariables(state)

      if (hasScreens(currentSectionData)) {
        return decrementWithScreens(state, currentSectionData, currentSectionIndex, currentScreenIndex)
      }

      return decrementWithoutScreens(state, currentSectionIndex)
    }
    default:
      return state
  }
}