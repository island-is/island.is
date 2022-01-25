import {} from '@island.is/regulations-tools/useTextWarnings'
import { makeDraftAppendixForm, steps } from './makeFields'
import { Action, ActionName, DraftingState } from './types'
import { derivedUpdates, makeHTMLWarnings } from './validations'
import { Draft } from 'immer'
import { errorMsgs } from '../messages'

/* eslint-disable @typescript-eslint/naming-convention */
export const actionHandlers: {
  [Type in ActionName]: (
    state: Draft<DraftingState>,
    action: Omit<Extract<Action, { type: Type }>, 'type'>,
  ) => Draft<DraftingState> | void
} = {
  CHANGE_STEP: (state, { stepName }) => {
    if (stepName === 'review' && !state.isEditor) {
      state.error = new Error('Must be an editor')
      return
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

  UPDATE_PROP: (state, { name, value, explicit }) => {
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
    if (value !== field.value || explicit === true) {
      field.value = value
      field.dirty = true

      if (field.type === 'html') {
        field.warnings = makeHTMLWarnings(field.value, true)
      }
    }
    field.error =
      field.required && !value && field.dirty
        ? errorMsgs.fieldRequired
        : undefined
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

      if (value !== field.value) {
        field.value = value
        field.dirty = true
        if (field.type === 'html') {
          field.warnings = makeHTMLWarnings(value, true)
        }
      }
      field.error =
        field.required && !value && field.dirty
          ? errorMsgs.fieldRequired
          : undefined
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

  UPDATE_MULTIPLE_PROPS: (state, { multiData }) => {
    Object.assign(state.draft, multiData)
  },

  UPDATE_LAWCHAPTER_PROP: (state, { action, value }) => {
    const lawChaptersField = state.draft.lawChapters
    const lawChapters = lawChaptersField.value
    const includesValue = lawChapters.includes(value)
    if (action === 'add') {
      if (!includesValue) {
        lawChaptersField.value = lawChapters.concat(value).sort()
      }
    } else {
      if (includesValue) {
        lawChaptersField.value = lawChapters.filter((slug) => slug !== value)
      }
    }
  },

  SHIP: (state) => {
    if (!state.isEditor) {
      state.error = new Error('Must be an editor')
    } else {
      state.shipping = true
    }
  },
}
/* eslint-enable @typescript-eslint/naming-convention */
