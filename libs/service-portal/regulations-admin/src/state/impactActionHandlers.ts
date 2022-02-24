import {} from '@island.is/regulations-tools/useTextWarnings'
import { makeDraftAppendixForm } from './makeFields'
import { DraftingImpactState, ImpactAction, ImpactActionName } from './types'
import { updateFieldValue } from './validations'
import { Draft } from 'immer'

/* eslint-disable @typescript-eslint/naming-convention */
export const impactActionHandlers: {
  [Type in ImpactActionName]: (
    state: Draft<DraftingImpactState>,
    action: Omit<Extract<ImpactAction, { type: Type }>, 'type'>,
  ) => Draft<DraftingImpactState> | void
} = {
  IMPACT_APPENDIX_ADD: (state) => {
    console.log('hello')
    const { appendixes } = state.impactDraft
    appendixes.push(
      makeDraftAppendixForm({ title: '', text: '' }, String(appendixes.length)),
    )
  },

  IMPACT_APPENDIX_SET_PROP: (state, { idx, name, value }) => {
    const appendix = state.impactDraft.appendixes[idx]
    if (appendix) {
      const field = appendix[name]
      // @ts-expect-error  (Fuu ... VSCode says no error, but if you remove this line, the build will fail. FML)
      value = tidyUp[field.type || '_'](value)

      updateFieldValue(field, value)
    }
  },

  IMPACT_APPENDIX_DELETE: (state, { idx }) => {
    const { appendixes } = state.impactDraft
    if (appendixes[idx]) {
      appendixes.splice(idx, 1)
    }
  },

  // // TODO: Adapt for impact appendixes
  // APPENDIX_REVOKE: (state, { idx, revoked }) => {
  //   const { appendixes } = state.draft
  //   const appendix = appendixes[idx]
  //   if (appendix) {
  //     appendix.revoked = revoked
  //   }
  // },

  IMPACT_APPENDIX_MOVE_UP: (state, { idx }) => {
    const prevIdx = idx - 1
    const { appendixes } = state.impactDraft
    const appendix = appendixes[idx]
    const prevAppendix = appendixes[prevIdx]
    if (appendix && prevAppendix) {
      appendixes[prevIdx] = appendix
      appendixes[idx] = prevAppendix
    }
  },

  IMPACT_SAVING_STATUS: (state) => {
    state.saving = true
  },
  IMPACT_SAVING_STATUS_DONE: (state, { error }) => {
    state.error = error
    state.saving = false
  },
}
/* eslint-enable @typescript-eslint/naming-convention */
