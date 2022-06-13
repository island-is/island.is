import {} from '@island.is/regulations-tools/useTextWarnings'
import { makeDraftAppendixForm, steps } from './makeFields'
import { Action, ActionName, DraftingState } from './types'
import {
  derivedUpdates,
  tidyUp,
  updateFieldValue,
  isDraftLocked,
} from './validations'
import { Draft } from 'immer'

/* eslint-disable @typescript-eslint/naming-convention */
export const actionHandlers: {
  [Type in ActionName]: (
    state: Draft<DraftingState>,
    action: Omit<Extract<Action, { type: Type }>, 'type'>,
  ) => Draft<DraftingState> | void
} = {
  CHANGE_STEP: (state, { stepName }) => {
    if (
      isDraftLocked(state.draft) &&
      stepName !== 'review' &&
      stepName !== 'publish'
    ) {
      state.step = steps.review
    }
    state.step = steps[stepName]
  },

  SAVING_STATUS: (state) => {
    state.saving = true
  },
  SAVING_STATUS_DONE: (state, { error }) => {
    state.error = error
    state.saving = false
  },

  UPDATE_PROP: (state, { name, value }) => {
    const field = state.draft[name]

    // @ts-expect-error  (Fuu)
    value = tidyUp[field.type || '_'](value)

    if (value !== field.value) {
      derivedUpdates[name]?.(
        state,
        // @ts-expect-error  (Pretty sure I'm holding this correctly,
        // and TS is in the weird here.
        // Name and value are intrinsically linked both in this action's
        // arguments and in the `specialUpdaters` signature.)
        value,
      )
    }
    updateFieldValue(field, value)
  },

  APPENDIX_ADD: (state) => {
    const { appendixes } = state.draft
    appendixes.push(
      makeDraftAppendixForm({ title: '', text: '' }, String(appendixes.length)),
    )
  },

  APPENDIX_SET_PROP: (state, { idx, name, value }) => {
    const appendix = state.draft.appendixes[idx]
    if (appendix) {
      const field = appendix[name]
      // @ts-expect-error  (Fuu ... VSCode says no error, but if you remove this line, the build will fail. FML)
      value = tidyUp[field.type || '_'](value)

      updateFieldValue(field, value)
    }
  },

  APPENDIX_DELETE: (state, { idx }) => {
    const { appendixes } = state.draft
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

  APPENDIX_MOVE_UP: (state, { idx }) => {
    const prevIdx = idx - 1
    const { appendixes } = state.draft
    const appendix = appendixes[idx]
    const prevAppendix = appendixes[prevIdx]
    if (appendix && prevAppendix) {
      appendixes[prevIdx] = appendix
      appendixes[idx] = prevAppendix
    }
  },

  APPENDIX_MOVE_DOWN: (state, { idx }) => {
    const nextIdx = idx + 1
    const { appendixes } = state.draft
    const appendix = appendixes[idx]
    const nextAppendix = appendixes[nextIdx]
    if (appendix && nextAppendix) {
      appendixes[nextIdx] = appendix
      appendixes[idx] = nextAppendix
    }
  },

  UPDATE_LAWCHAPTER_PROP: (state, { action, value }) => {
    const lawChaptersField = state.draft.lawChapters
    const lawChapters = lawChaptersField.value
    const includesValue = lawChapters.includes(value)

    if (action === 'add') {
      if (!includesValue) {
        updateFieldValue(lawChaptersField, lawChapters.concat(value).sort())
      }
    } else {
      if (includesValue) {
        updateFieldValue(
          lawChaptersField,
          lawChapters.filter((slug) => slug !== value),
        )
      }
    }
  },

  SET_IMPACT: (state, { impactId }) => {
    if (impactId) {
      Object.entries(state.draft.impacts).forEach(([key, impacts]) => {
        if (impacts.find((c) => c.id === impactId)) {
          state.activeImpact = impactId
        }
      })
    }
    // ignore invalid/uknown `impactId`s
    state.activeImpact = undefined
  },
}
/* eslint-enable @typescript-eslint/naming-convention */
