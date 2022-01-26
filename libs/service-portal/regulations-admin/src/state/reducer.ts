import { Reducer, useReducer } from 'react'
import { Step } from '../types'
import { MinistryList } from '@island.is/regulations'
import { Action, DraftChangeForm, DraftingState, HtmlDraftField } from './types'
import { produce, setAutoFreeze } from 'immer'
import { RegulationDraft } from '@island.is/regulations/admin'
import { useAuth } from '@island.is/auth/react'
import { RegulationsAdminScope } from '@island.is/auth/scopes'
import { derivedUpdates } from './validations'
import { makeHighAngstWarnings } from '@island.is/regulations-tools/useTextWarnings'
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

  if (stepName === 'review' && !isEditor) {
    throw new Error()
  }

  const makeInitialState = () => {
    const draft = makeDraftForm(regulationDraft)
    const state: DraftingState = {
      draft,
      step: steps[stepName],
      ministries,
      isEditor,
    }

    // Derive all guesssed values on start.
    Object.entries(derivedUpdates).forEach(([prop, updaterFn]) => {
      updaterFn!(
        state,
        // @ts-expect-error  (because reasons)
        draft[prop as RegDraftFormSimpleProps].value,
      )
    })

    // Check for TextWarnings of all HTMLText fields
    const [validateHTML, validateImpactHTML] = [false, true].map(
      (isImpact) => (field: HtmlDraftField) => {
        if (field.value) {
          field.warnings = makeHighAngstWarnings(field.value, isImpact)
        }
      },
    )

    validateHTML(draft.text)
    draft.appendixes.map((a) => a.text).forEach(validateHTML)
    validateHTML(draft.comments)
    draft.impacts
      .filter((i): i is DraftChangeForm => i.type === 'amend')
      .forEach((impact) => {
        validateImpactHTML(impact.text)
        impact.appendixes.map((a) => a.text).forEach(validateImpactHTML)
        validateImpactHTML(impact.comments)
      })
    // // NOTE: Drafting notes don't need to adhere to any specific HTML rules.
    // validateHTML(draft.draftingNotes)

    return state
  }

  return useReducer(draftingStateReducer, {}, makeInitialState)
}
