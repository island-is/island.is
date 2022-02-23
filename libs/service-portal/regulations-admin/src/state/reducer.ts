import { Reducer, useReducer } from 'react'
import { Step } from '../types'
import { LawChapter, MinistryList } from '@island.is/regulations'
import {
  Action,
  DraftChangeForm,
  DraftingState,
  DraftingImpactState,
  ImpactAction,
} from './types'
import { produce, setAutoFreeze } from 'immer'
import {
  DraftImpactId,
  DraftImpactName,
  DraftRegulationChangeId,
  RegulationDraft,
} from '@island.is/regulations/admin'
import { useAuth } from '@island.is/auth/react'
import { RegulationsAdminScope } from '@island.is/auth/scopes'
import { derivedUpdates, validateState } from './validations'
import { makeDraftChangeForm, makeDraftForm, steps } from './makeFields'
import { actionHandlers } from './actionHandlers'
import { impactActionHandlers } from './impactActionHandlers'

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

const impactDraftingStateReducer: Reducer<DraftingImpactState, ImpactAction> = (
  state,
  action,
) => {
  setAutoFreeze(false)
  const newState = produce(state, (sDraft) =>
    impactActionHandlers[action.type](
      sDraft,
      // @ts-expect-error  (Can't get this to work. FML)
      action,
    ),
  )
  setAutoFreeze(true)
  return newState
}

// ===========================================================================

export type ImpactStateInputs = {
  draft: DraftChangeForm
  stepName: Step
}

export const useEditImpactDraftReducer = (inputs: ImpactStateInputs) => {
  const { stepName } = inputs
  const isEditor =
    useAuth().userInfo?.scopes?.includes(RegulationsAdminScope.manage) || false

  const makeInitialState = () => {
    const impactDraft = makeDraftChangeForm({
      type: 'amend',
      id: '' as DraftRegulationChangeId, // no ID available at this stage
      name: '' as DraftImpactName,
      regTitle: '',
      title: '',
      text: '',
      appendixes: [],
      comments: '',
    })
    const state: DraftingImpactState = {
      impactDraft,
      step: steps[stepName],
      isEditor,
    }

    // validateState(state)

    return state
  }

  return useReducer(impactDraftingStateReducer, {}, makeInitialState)
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
    useAuth().userInfo?.scopes?.includes(RegulationsAdminScope.manage) || false

  const makeInitialState = () => {
    const draft = makeDraftForm(regulationDraft)
    const state: DraftingState = {
      draft,
      step: steps[stepName],
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
