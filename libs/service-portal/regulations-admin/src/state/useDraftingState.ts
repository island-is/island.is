import { useMutation, gql } from '@apollo/client'
import { HTMLText, LawChapterSlug, PlainText } from '@island.is/regulations'
import { useAuth } from '@island.is/auth/react'
import { ServicePortalPath } from '@island.is/service-portal/core'
import { FC, Reducer, useEffect, useMemo, useReducer } from 'react'
import { produce, setAutoFreeze, Draft } from 'immer'
import { useHistory, generatePath } from 'react-router-dom'
import { Step } from '../types'
import {
  findRegulationType,
  findSignatureInText,
  getInputFieldsWithErrors,
  useLocale,
} from '../utils'
import { mockSave } from '../_mockData'
import { RegulationsAdminScope } from '@island.is/auth/scopes'
import { RegulationDraft } from '@island.is/regulations/admin'
import {
  StepNav,
  DraftField,
  HtmlDraftField,
  RegDraftForm,
  DraftingState,
  RegDraftFormSimpleProps,
  Action,
  ActionName,
  AppendixFormSimpleProps,
  AppendixDraftForm,
  InputType,
} from './types'
import { errorMsgs } from '../messages'
import {
  RegulationAppendix,
  RegulationMinistryList,
} from '@island.is/regulations/web'

export const UPDATE_DRAFT_REGULATION_MUTATION = gql`
  mutation UpdateDraftRegulationMutation($input: EditDraftRegulationInput!) {
    updateDraftRegulationById(input: $input)
  }
`

export const DELETE_DRAFT_REGULATION_MUTATION = gql`
  mutation DeleteDraftRegulationMutation($input: DeleteDraftRegulationInput!) {
    deleteDraftRegulation(input: $input) {
      id
    }
  }
`

// ---------------------------------------------------------------------------

export const steps: Record<Step, StepNav> = {
  basics: {
    name: 'basics',
    next: 'meta',
  },
  meta: {
    name: 'meta',
    prev: 'basics',
    next: 'signature',
  },
  signature: {
    name: 'signature',
    prev: 'meta',
    next: 'impacts',
  },
  impacts: {
    name: 'impacts',
    prev: 'signature',
    next: 'review',
  },
  review: {
    name: 'review',
    prev: 'impacts',
  },
}

// ---------------------------------------------------------------------------

const tidyUp = {
  text: (value: string) => value.trimLeft() as PlainText,
  html: (value: HTMLText) => value.trimLeft() as HTMLText,
  _: <T extends unknown>(value: T) => value,
} as const

// ---------------------------------------------------------------------------

const f = <T>(
  value: T,
  required?: true,
  type?: Exclude<InputType, 'html' | 'text'>,
): DraftField<T> => ({
  value,
  required,
  type,
})
const fText = <T extends string>(value: T, required?: true): DraftField<T> => ({
  value,
  required,
  type: 'text',
})
const fHtml = (value: HTMLText, required?: true): HtmlDraftField => ({
  value,
  required,
  type: 'html',
})

const makeDraftAppendixForm = (appendix: RegulationAppendix, key: string) => ({
  title: fText(appendix.title, true),
  text: fHtml(appendix.text, true),
  key,
})

const makeDraftForm = (
  draft: RegulationDraft,
  /** Default initial `dirty` state for all fields */
): RegDraftForm => {
  const form: RegDraftForm = {
    id: draft.id,
    title: fText(draft.title, true),
    text: fHtml(draft.text, true),
    appendixes: draft.appendixes.map((a, i) =>
      makeDraftAppendixForm(a, String(i)),
    ),
    comments: fHtml(draft.comments),

    idealPublishDate: f(
      draft.idealPublishDate && new Date(draft.idealPublishDate),
    ),
    fastTrack: f(draft.fastTrack || false),

    effectiveDate: f(draft.effectiveDate && new Date(draft.effectiveDate)),

    signatureDate: f(
      draft.signatureDate && new Date(draft.signatureDate),
      true,
    ),
    signatureText: fHtml(draft.signatureText),
    signedDocumentUrl: f(draft.signedDocumentUrl),

    lawChapters: f((draft.lawChapters || []).map((chapter) => chapter.slug)),
    ministry: f(draft.ministry?.slug, true),
    type: f(draft.type, true),

    impacts: draft.impacts.map((impact) =>
      impact.type === 'amend'
        ? {
            id: impact.id,
            type: impact.type,
            name: impact.name,
            date: f(new Date(impact.date), true),
            ...{
              title: fText(impact.title, true),
              text: fHtml(impact.text, true),
              appendixes: impact.appendixes.map((a, i) =>
                makeDraftAppendixForm(a, String(i)),
              ),
              comments: fHtml(impact.comments),
            },
          }
        : {
            id: impact.id,
            type: impact.type,
            name: impact.name,
            date: f(new Date(impact.date)),
          },
    ),

    draftingNotes: fHtml(draft.draftingNotes),
    draftingStatus: draft.draftingStatus,
    authors: f(draft.authors.map((author) => author.authorId)),
  }
  return form
}

// ---------------------------------------------------------------------------

// const validate = (state: DraftingState) => {
//   return
// }

// const validateSingle = <Field extends keyof RegulationDraft>(
//   state: DraftingState,
//   name: Field,
//   value: RegulationDraft[Field],
// ) => {
//   return
// }

// ---------------------------------------------------------------------------

const specialUpdates: {
  [Prop in RegDraftFormSimpleProps]?: (
    state: DraftingState,
    newValue?: RegDraftForm[Prop]['value'],
  ) => RegDraftForm[Prop]['value'] | null | void
} = {
  title: (state: DraftingState, newTitle?: PlainText) => {
    const draft = state.draft
    if (!draft) return
    const type = draft.type
    if (newTitle !== draft.title.value && (!type.value || type.guessed)) {
      type.value = findRegulationType(newTitle ?? draft.title.value)
      type.guessed = true
    }
  },

  signatureText: (state, newValue) => {
    const draft = state.draft
    if (!draft) return
    const signatureText = draft.signatureText
    if (newValue !== signatureText.value) {
      const { ministrySlug, signatureDate } = findSignatureInText(
        newValue ?? signatureText.value,
        state.ministries,
      )
      const ministry = draft.ministry
      if (!ministry.value || ministry.guessed) {
        ministry.value = ministrySlug
        ministry.guessed = true
      }
      draft.signatureDate.value = signatureDate
    }
  },
}

// ---------------------------------------------------------------------------

/* eslint-disable @typescript-eslint/naming-convention */
const actionHandlers: {
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
    state.stepName = stepName
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
    if (value !== field.value || explicit === true) {
      // @ts-expect-error  (Fuu)
      field.value = tidyUp[field.type || '_'](value)
      field.dirty = true
      field.guessed = false
    }
    field.error =
      field.required && !field.value && field.dirty
        ? errorMsgs.fieldRequired
        : undefined

    specialUpdates[name]?.(
      state,
      // @ts-expect-error  (Pretty sure I'm holding this correctly,
      // and TS is in the weird here.
      // Name and value are intrinsically linked both in this action's
      // arguments and in the `specialUpdaters` signature.)
      value,
    )
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
      if (value !== field.value) {
        // @ts-expect-error  (Fuu)
        field.value = tidyUp[field.type || '_'](value)
        field.dirty = true
        field.guessed = false
      }
      field.error =
        field.required && !field.value && field.dirty
          ? errorMsgs.fieldRequired
          : undefined
    }
  },

  APPENDIX_REMOVE: (state, { idx }) => {
    const { appendixes } = state.draft
    if (appendixes[idx]) {
      appendixes.splice(idx, 1)
    }
  },

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

// ---------------------------------------------------------------------------

export const useDraftingState = (
  draft: RegulationDraft,
  ministries: RegulationMinistryList,
  stepName: Step,
) => {
  const history = useHistory()
  const isEditor =
    useAuth().userInfo?.scopes?.includes(RegulationsAdminScope.manage) || false

  if (stepName === 'review' && !isEditor) {
    throw new Error()
  }

  const t = useLocale().formatMessage

  const [state, dispatch] = useReducer(draftingStateReducer, {}, () => ({
    draft: makeDraftForm(draft),
    stepName,
    ministries,
    isEditor,
  }))

  useEffect(() => {
    dispatch({ type: 'CHANGE_STEP', stepName })
  }, [stepName])

  const [deleteDraftRegulationMutation] = useMutation(
    DELETE_DRAFT_REGULATION_MUTATION,
  )
  const [updateDraftRegulationById] = useMutation(
    UPDATE_DRAFT_REGULATION_MUTATION,
  )

  const stepNav = steps[stepName]

  const actions = useMemo(() => {
    return {
      goBack: stepNav.prev
        ? () => {
            actions.saveStatus()
            history.replace(
              generatePath(ServicePortalPath.RegulationsAdminEdit, {
                id: draft.id,
                step: stepNav.prev,
              }),
            )
          }
        : undefined,
      goForward:
        stepNav.next && (isEditor || stepNav.next !== 'review')
          ? () => {
              actions.saveStatus()

              // BASICS
              if (stepNav.name === 'basics') {
                const basicsRequired = [
                  'title',
                  'text',
                ] as RegDraftFormSimpleProps[]

                const errorFields = getInputFieldsWithErrors(
                  basicsRequired,
                  state.draft,
                )

                if (errorFields) {
                  dispatch({
                    type: 'UPDATE_MULTIPLE_PROPS',
                    multiData: errorFields,
                  })
                  return // Prevent the user going forward
                }
              }

              // META
              if (stepNav.name === 'meta') {
                const metaRequired = [
                  'ministry',
                  'type',
                  'signatureDate',
                ] as RegDraftFormSimpleProps[]

                const errorFields = getInputFieldsWithErrors(
                  metaRequired,
                  state.draft,
                )

                if (errorFields) {
                  dispatch({
                    type: 'UPDATE_MULTIPLE_PROPS',
                    multiData: errorFields,
                  })
                  return // Prevent the user going forward
                }
              }

              history.replace(
                generatePath(ServicePortalPath.RegulationsAdminEdit, {
                  id: draft.id,
                  step: stepNav.next,
                }),
              )
            }
          : undefined,

      // FIXME: rename to updateProp??
      updateState: <Prop extends RegDraftFormSimpleProps>(
        name: Prop,
        value: RegDraftForm[Prop]['value'],
        explicit?: boolean,
      ) => {
        // @ts-expect-error  (FML! FIXME: make this nicer)
        dispatch({ type: 'UPDATE_PROP', name, value, explicit })
      },

      setAppendixProp: <Prop extends AppendixFormSimpleProps>(
        idx: number,
        name: Prop,
        value: AppendixDraftForm[Prop]['value'],
      ) => {
        // @ts-expect-error  (FML! FIXME: make this nicer)
        dispatch({ type: 'APPENDIX_SET_PROP', idx, name, value })
      },

      removeAppendix: (idx: number) => {
        dispatch({ type: 'APPENDIX_REMOVE', idx })
      },
      moveAppendixUp: (idx: number) => {
        dispatch({ type: 'APPENDIX_MOVE_UP', idx })
      },

      addAppendix: () => {
        dispatch({ type: 'APPENDIX_ADD' })
      },

      updateLawChapterProp: (
        action: 'add' | 'delete',
        value: LawChapterSlug,
      ) => {
        dispatch({ type: 'UPDATE_LAWCHAPTER_PROP', action, value })
      },

      deleteDraft: async () => {
        if (draft.draftingStatus === 'shipped') {
          return
        }
        try {
          await deleteDraftRegulationMutation({
            variables: {
              input: {
                draftId: draft.id,
              },
            },
          }).then(() => {
            // TODO: Láta notanda vita að færslu hefur verið eytt út?
            history.push(ServicePortalPath.RegulationsAdminRoot)
          })
        } catch (e) {
          console.error('Failed to delete regulation draft: ', e)
          return
        }
      },

      saveStatus: () => {
        dispatch({ type: 'SAVING_STATUS' })
        const draft = state.draft
        updateDraftRegulationById({
          variables: {
            input: {
              id: draft.id,
              body: {
                title: draft.title.value,
                text: draft.text.value, // (text + appendix + comments)
                ministry_id: draft.ministry.value,
                drafting_notes: draft.draftingNotes.value,
                ideal_publish_date: draft.idealPublishDate?.value,
                law_chapters: draft.lawChapters.value,
                signature_date: draft.signatureDate.value,
                effective_date: draft.effectiveDate.value,
                type: draft.type.value,
              },
            },
          },
        })
          .then((res) => {
            dispatch({ type: 'SAVING_STATUS_DONE' })
          })
          .catch((error) => {
            dispatch({ type: 'SAVING_STATUS_DONE', error: error as Error })
          })
      },

      propose: !isEditor
        ? () => {
            // FIXME: Make this work
            mockSave({ ...draft, draftingStatus: 'proposal' }).then(() => {
              history.push(ServicePortalPath.RegulationsAdminRoot)
            })
          }
        : undefined,
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    stepNav,
    // TODO: Review the use of draft here, and remove if possible.
    draft,
    isEditor,
    state,

    history, // NOTE: Should be immutable
    updateDraftRegulationById, // NOTE: Should be immutable
    deleteDraftRegulationMutation, // NOTE: Should be immutable
    t,
  ])

  return {
    state,
    stepNav,
    actions,
  }
}

export type RegDraftActions = ReturnType<typeof useDraftingState>['actions']

// ===========================================================================

export type StepComponent = (props: {
  draft: RegDraftForm
  actions: ReturnType<typeof useDraftingState>['actions'] // FIXME: Ick! Ack!
}) => ReturnType<FC>
