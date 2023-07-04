import { Reducer, useReducer } from 'react'
import { RegulationDraftTypes, Step } from '../types'
import { LawChapter, MinistryList } from '@island.is/regulations'
import { Action, DraftingState, RegDraftFormSimpleProps } from './types'
import { produce, setAutoFreeze } from 'immer'
import { DraftImpactId, RegulationDraft } from '@island.is/regulations/admin'
import { useAuth } from '@island.is/auth/react'
import { AdminPortalScope } from '@island.is/auth/scopes'
import { derivedUpdates, validateState } from './validations'
import { makeDraftForm, stepsAmending, stepsBase } from './makeFields'
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
  activeImpact?: DraftImpactId
  ministries: MinistryList
  lawChapters: Array<LawChapter>
  stepName: Step
}

export const useEditDraftReducer = (inputs: StateInputs) => {
  const { regulationDraft, ministries, lawChapters, stepName } = inputs

  const isEditor =
    useAuth().userInfo?.scopes?.includes(
      AdminPortalScope.regulationAdminManage,
    ) || false

  const makeInitialState = () => {
    const draft = makeDraftForm(regulationDraft)
    const state: DraftingState = {
      draft,
      step:
        draft.type.value === RegulationDraftTypes.amending
          ? stepsAmending[stepName]
          : stepsBase[stepName],
      ministries,
      lawChapters: {
        list: lawChapters,
        bySlug: lawChapters.reduce<Record<string, string>>((map, ch) => {
          map[ch.slug] = ch.name
          return map
        }, {}),
      },
      isEditor,
    }

    validateState(state)

    // Derive all guesssed values on start.
    Object.entries(derivedUpdates).forEach(([prop, updaterFn]) => {
      updaterFn(
        state,
        // @ts-expect-error  (because reasons)
        draft[prop as RegDraftFormSimpleProps].value,
      )
    })

    return state
  }

  return useReducer(draftingStateReducer, {}, makeInitialState)
}
