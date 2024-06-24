import { FormSystemStep, FormSystemGroup } from "@island.is/api/schema"

export type PreviewControlActions =
  | { type: 'INCREMENT' }

export interface PreviewControlState {
  steps: FormSystemStep[]
  groups: FormSystemGroup[]
  currentStep: string
  currentGroup: string
}

export const previewControlReducer = (state: PreviewControlState, action: PreviewControlActions) => {

  switch (action.type) {
    case 'INCREMENT': {
      const isInputStep = state.steps.find(step => step.guid === )
      return state
    }

    default:
      return state
  }
}
