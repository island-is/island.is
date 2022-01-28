import { Reducer, useReducer } from 'react'
import { Step } from '../types'
import { MinistryList } from '@island.is/regulations'
import { Action, DraftingState } from './types'
import { produce, setAutoFreeze } from 'immer'
import { RegulationDraft } from '@island.is/regulations/admin'
import { useAuth } from '@island.is/auth/react'
import { RegulationsAdminScope } from '@island.is/auth/scopes'
import { derivedUpdates, validateState } from './validations'
import { makeDraftForm, steps } from './makeFields'
import { actionHandlers } from './actionHandlers'

const draftingStateReducer: Reducer<DraftingState, Action> = (
  state,
  action,
) => {
  setAutoFreeze(false)
  const newState = produce(state, (sDraft) =>
    actionHandlers[action.type](
      sDraft,
      // @ts-expect-error  (Can't get this to work. FML)
      action,
    ),
  )
  setAutoFreeze(true)
  return newState
}

// ===========================================================================

export type StateInputs = {
  regulationDraft: RegulationDraft
  ministries: MinistryList
  stepName: Step
}

export const useEditDraftReducer = (inputs: StateInputs) => {
  const { regulationDraft, ministries, stepName } = inputs

  const isEditor =
    useAuth().userInfo?.scopes?.includes(RegulationsAdminScope.manage) || false

  const makeInitialState = () => {
    const draft = makeDraftForm(regulationDraft)
    const state: DraftingState = {
      draft,
      step: steps[stepName],
      ministries,
      isEditor,
    }

    validateState(state)

    // Derive all guesssed values on start.
    Object.entries(derivedUpdates).forEach(([prop, updaterFn]) => {
      updaterFn!(
        state,
        // @ts-expect-error  (because reasons)
        draft[prop as RegDraftFormSimpleProps].value,
      )
    })

    return state
  }

  return useReducer(draftingStateReducer, {}, makeInitialState)
}
