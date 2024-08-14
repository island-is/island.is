import { FormSystemStep, FormSystemGroup } from '@island.is/api/schema'

export type PreviewControlActions =
  | { type: 'INCREMENT' }
  | { type: 'DECREMENT' }

export interface PreviewControlState {
  steps: FormSystemStep[]
  groups: FormSystemGroup[]
  currentStep: {
    index: number
    guid: string
  }
  currentGroup: {
    index: number
    guid: string
  }
}

const getNextIndex = (current: number, max: number) =>
  Math.min(current + 1, max - 1)

const getPreviousIndex = (current: number) => Math.max(current - 1, 0)

const updateStep = (state: PreviewControlState, newIndex: number) => ({
  index: newIndex,
  guid: state.steps[newIndex]?.guid ?? '',
})

const updateGroup = (state: PreviewControlState, newIndex: number) => ({
  index: newIndex,
  guid: state.groups[newIndex]?.guid ?? '',
})

const isInputStep = (state: PreviewControlState) =>
  state.steps.find((step) => step.guid === state.currentStep.guid)?.type ===
  'Input'

export const initialPreviewControlState = (
  steps: FormSystemStep[],
  groups: FormSystemGroup[],
): PreviewControlState => ({
  steps,
  groups,
  currentStep: updateStep({ steps } as PreviewControlState, 0),
  currentGroup: updateGroup({ groups } as PreviewControlState, 0),
})

export const previewControlReducer = (
  state: PreviewControlState,
  action: PreviewControlActions,
): PreviewControlState => {
  const { currentStep, currentGroup, steps, groups } = state

  switch (action.type) {
    case 'INCREMENT': {
      const newState = { ...state }
      if (isInputStep(state)) {
        if (currentGroup.index < groups.length) {
          const newGroupIndex = getNextIndex(currentGroup.index, groups.length)
          newState.currentGroup = updateGroup(state, newGroupIndex)

          if (steps[currentStep.index].guid !== groups[newGroupIndex].stepGuid) {
            newState.currentStep = updateStep(
              state,
              getNextIndex(currentStep.index, steps.length),
            )
          }
        }
        if (currentGroup.index === groups.length - 1) {
          newState.currentStep = updateStep(
            state,
            getNextIndex(currentStep.index, steps.length)
          )
        }

      } else {
        newState.currentStep = updateStep(
          state,
          getNextIndex(currentStep.index, steps.length),
        )
      }

      return newState
    }

    case 'DECREMENT': {
      const newState = { ...state }

      if (isInputStep(state)) {
        if (currentGroup.index > 0) {
          const newGroupIndex = getPreviousIndex(currentGroup.index)
          newState.currentGroup = updateGroup(state, newGroupIndex)

          if (
            steps[currentStep.index].guid !== groups[newGroupIndex].stepGuid
          ) {
            newState.currentStep = updateStep(
              state,
              getPreviousIndex(currentStep.index),
            )
          }
        }
        if (currentGroup.index === 0) {
          newState.currentStep = updateStep(
            state,
            getPreviousIndex(currentStep.index),
          )
        }
      } else {
        newState.currentStep = updateStep(
          state,
          getPreviousIndex(currentStep.index),
        )
      }

      return newState
    }

    default:
      return state
  }
}
