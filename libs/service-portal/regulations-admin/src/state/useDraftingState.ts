import { useMutation, gql } from '@apollo/client'
import { HTMLText, LawChapterSlug, PlainText } from '@island.is/regulations'
import { useRegulationDraftQuery } from '@island.is/service-portal/graphql'
import { useAuth } from '@island.is/auth/react'
import { ServicePortalPath } from '@island.is/service-portal/core'
import { FC, Reducer, useEffect, useMemo, useReducer } from 'react'
import { produce, setAutoFreeze } from 'immer'
import { useHistory, generatePath } from 'react-router-dom'
import { Step } from '../types'
import { getAllGuessableValues, getInputFieldsWithErrors } from '../utils'
import { mockSave } from '../_mockData'
import { RegulationsAdminScope } from '@island.is/auth/scopes'
import {
  RegulationDraft,
  RegulationDraftId,
} from '@island.is/regulations/admin'
import {
  DraftIdFromParam,
  StepNav,
  DraftField,
  HtmlDraftField,
  RegDraftForm,
  DraftingState,
  RegDraftFormSimpleProps,
  Action,
  ActionName,
} from './types'
import { uuid } from 'uuidv4'
import { useIntl } from 'react-intl'
import { buttonsMsgs } from '../messages'

export const CREATE_DRAFT_REGULATION_MUTATION = gql`
  mutation CreateDraftRegulationMutation($input: CreateDraftRegulationInput!) {
    createDraftRegulation(input: $input)
  }
`

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
    next: 'impacts',
  },
  impacts: {
    name: 'impacts',
    prev: 'meta',
    next: 'review',
  },
  review: {
    name: 'review',
    prev: 'impacts',
  },
}

// ---------------------------------------------------------------------------

const makeDraftForm = (
  draft: RegulationDraft,
  dirty?: boolean,
): RegDraftForm => {
  const f = <T>(value: T): DraftField<T> => ({ value, dirty })
  const fHtml = (value: HTMLText): HtmlDraftField => ({ value, dirty })

  const form: RegDraftForm = {
    id: draft.id,
    title: f(draft.title),
    text: fHtml(draft.text),
    appendixes: draft.appendixes?.map((appendix) => ({
      title: f(appendix.title),
      text: fHtml(appendix.text),
    })),
    comments: fHtml(draft.comments),

    idealPublishDate: f(
      draft.idealPublishDate && new Date(draft.idealPublishDate),
    ),
    fastTrack: f(draft.fastTrack || false),

    signatureDate: f(draft.signatureDate && new Date(draft.signatureDate)),
    effectiveDate: f(draft.effectiveDate && new Date(draft.effectiveDate)),

    lawChapters: f((draft.lawChapters || []).map((chapter) => chapter.slug)),
    ministry: f(draft.ministry?.slug),
    type: f(draft.type),

    impacts: draft.impacts?.map((impact) =>
      impact.type === 'amend'
        ? {
            id: impact.id,
            type: impact.type,
            name: impact.name,
            date: f(new Date(impact.date)),
            ...{
              title: f(impact.title),
              text: fHtml(impact.text),
              appendixes: impact.appendixes.map((appendix) => ({
                title: f(appendix.title),
                text: fHtml(appendix.text),
              })),
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
    authors: f(draft.authors?.map((author) => author.authorId)),
  }
  return form
}

const getEmptyDraft = (): RegulationDraft => ({
  id: 'new' as RegulationDraftId,
  draftingStatus: 'draft',
  draftingNotes: '' as HTMLText,
  authors: [],
  title: '',
  text: '' as HTMLText,
  appendixes: [],
  comments: '' as HTMLText,
  ministry: undefined,
  lawChapters: [],
  impacts: [],
})

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

/* eslint-disable @typescript-eslint/naming-convention */
const actionHandlers: {
  [Type in ActionName]: (
    state: DraftingState,
    action: Omit<Extract<Action, { type: Type }>, 'type'>,
  ) => DraftingState | void
} = {
  CHANGE_STEP: (state, { stepName }) => {
    if (stepName === 'review' && !state.isEditor) {
      state.error = new Error('Must be an editor')
      return
    }
    state.stepName = stepName
    return
  },

  LOADING_DRAFT: (state) => {
    state.loading = true
  },
  LOADING_DRAFT_SUCCESS: (state, { draft }) => {
    state.loading = false
    state.draft = makeDraftForm(draft)
  },
  LOADING_DRAFT_ERROR: (state, { error }) => {
    state.loading = false
    state.error = error
    state.draft = undefined
  },

  SAVING_STATUS: (state) => {
    state.savingStatus = true
  },
  SAVING_STATUS_DONE: (state, { error }) => {
    state.error = error
    state.savingStatus = false
  },

  UPDATE_PROP: (state, { name, value }) => {
    if (!state.draft) {
      return
    }
    const prop = state.draft[name]
    // @ts-expect-error  (FML! type matching of name and value is guaranteed, but TS can't tell)
    prop.value = value
    prop.error = !prop.value ? 'empty' : undefined
  },

  UPDATE_MULTIPLE_PROPS: (state, { multiData }) => {
    if (!state.draft) {
      return
    }

    state.draft = {
      ...state.draft,
      ...multiData,
    }
  },

  UPDATE_LAWCHAPTER_PROP: (state, { action, value }) => {
    if (!state.draft) {
      return
    }
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
      state.loading = true
    }
  },
}
/* eslint-enable @typescript-eslint/naming-convention */

const draftingStateReducer: Reducer<DraftingState, Action> = (
  state,
  action,
) => {
  setAutoFreeze(false)
  const newState = produce(state, (draft) =>
    actionHandlers[action.type](
      draft,
      // @ts-expect-error  (Can't get this to work. FML)
      action,
    ),
  )
  setAutoFreeze(true)
  return newState
}

// ---------------------------------------------------------------------------

const getInitialState = (args: {
  draftId: DraftIdFromParam
  stepName: Step
  isEditor: boolean
}): DraftingState => {
  const { draftId, stepName, isEditor } = args
  if (draftId === 'new') {
    return {
      isEditor,
      stepName,
      loading: false,
      draft: makeDraftForm(getEmptyDraft()),
    }
  }
  return {
    isEditor,
    stepName,
    loading: true,
  }
}

// ---------------------------------------------------------------------------

export const useDraftingState = (draftId: DraftIdFromParam, stepName: Step) => {
  const history = useHistory()
  const isEditor =
    useAuth().userInfo?.scopes?.includes(RegulationsAdminScope.manage) || false

  if (stepName === 'review' && !isEditor) {
    throw new Error()
  }

  const t = useIntl().formatMessage

  const [state, dispatch] = useReducer(
    draftingStateReducer,
    { draftId, stepName, isEditor },
    getInitialState,
  )

  const isNew = draftId === 'new'
  const { draft, loading, error } = useRegulationDraftQuery(
    isNew && !state.error,
    draftId,
  )

  const [deleteDraftRegulationMutation] = useMutation(
    DELETE_DRAFT_REGULATION_MUTATION,
  )

  useEffect(() => {
    dispatch({ type: 'CHANGE_STEP', stepName })
  }, [stepName])

  useEffect(() => {
    if (loading) {
      dispatch({ type: 'LOADING_DRAFT' })
      return
    } else if (error) {
      dispatch({ type: 'LOADING_DRAFT_ERROR', error })
    } else if (draft) {
      dispatch({ type: 'LOADING_DRAFT_SUCCESS', draft })
    }
  }, [loading, error, draft])

  const [createDraftRegulation] = useMutation(CREATE_DRAFT_REGULATION_MUTATION)
  const [updateDraftRegulationById] = useMutation(
    UPDATE_DRAFT_REGULATION_MUTATION,
  )

  const stepNav = steps[stepName]

  const actions = useMemo(() => {
    const isNew = draftId === 'new'

    return {
      goBack:
        (draft || isNew) && stepNav.prev
          ? () => {
              history.replace(
                generatePath(ServicePortalPath.RegulationsAdminEdit, {
                  id: draftId,
                  step: stepNav.prev,
                }),
              )
            }
          : undefined,
      goForward:
        (draft || isNew) &&
        stepNav.next &&
        (isEditor || stepNav.next !== 'review')
          ? () => {
              // BASICS
              if (stepNav.name === 'basics') {
                const basicsRequired = [
                  'title',
                  'text',
                  'idealPublishDate',
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
                } else {
                  const guessableValues = getAllGuessableValues(
                    state.draft?.text.value as HTMLText,
                    state.draft?.title.value as PlainText,
                  )
                  dispatch({
                    type: 'UPDATE_MULTIPLE_PROPS',
                    multiData: guessableValues,
                  })
                }
              }

              // META
              if (stepNav.name === 'meta') {
                const metaRequired = [
                  'ministry',
                  'type',
                  'signatureDate',
                  'effectiveDate',
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
                  id: draftId,
                  step: stepNav.next,
                }),
              )
            }
          : undefined,
      saveStatus: draft
        ? () => {
            if (isNew) {
              createDraftRegulation({
                variables: {
                  input: {
                    id: uuid(),
                    drafting_status: 'draft',
                    title: state.draft?.title.value,
                    text: state.draft?.text.value, // (text + appendix + comments)
                    drafting_notes: state.draft?.draftingNotes.value,
                    ministry_id: state.draft?.ministry.value || '',
                    ideal_publish_date: state.draft?.idealPublishDate.value,
                    type: 'base', // Ritill
                  },
                },
              }).then((res) => {
                const newDraft = res.data
                  ? (res.data.createDraftRegulation as RegulationDraft)
                  : undefined
                if (newDraft?.id) {
                  history.replace(
                    generatePath(ServicePortalPath.RegulationsAdminEdit, {
                      id: newDraft?.id,
                      step: stepNav.next,
                    }),
                  )
                }
              })
            } else {
              updateDraftRegulationById({
                variables: {
                  input: {
                    id: state.draft?.id,
                    body: {
                      title: state.draft?.title?.value,
                      text: state.draft?.text?.value, // (text + appendix + comments)
                      ministry_id: state.draft?.ministry?.value,
                      drafting_notes: state.draft?.draftingNotes.value,
                      ideal_publish_date: state.draft?.idealPublishDate?.value,
                      law_chapters: state.draft?.lawChapters?.value,
                      signature_date: state.draft?.signatureDate?.value,
                      effective_date: state.draft?.effectiveDate?.value,
                      type: state.draft?.type?.value,
                    },
                  },
                },
              }).then((res) => {
                console.log('!!DRAFT UPDATED!! ', res)
              })
            }
          }
        : () => undefined,

      // FIXME: rename to updateProp??
      updateState: <Prop extends RegDraftFormSimpleProps>(
        name: Prop,
        value: RegDraftForm[Prop]['value'],
      ) => {
        // @ts-expect-error  (FML! FIXME: make this nicer)
        dispatch({ type: 'UPDATE_PROP', name, value })
      },

      deleteDraft: async () => {
        if (
          isNew ||
          // eslint-disable-next-line no-restricted-globals
          !confirm(t(buttonsMsgs.confirmDelete))
        ) {
          return
        }
        // TODO: Dialog opens to CONFIRM the deletion by user?
        try {
          await deleteDraftRegulationMutation({
            variables: {
              input: {
                draftId,
              },
            },
          }).then(() => {
            // TODO: Láta notanda vita að færslu hefur verið eytt út?
            history.push(ServicePortalPath.RegulationsAdminRoot)
          })
        } catch (e) {
          console.error('delete draft regulation error: ', e)
          return
        }
      },

      updateLawChapterProp: (
        action: 'add' | 'delete',
        value: LawChapterSlug,
      ) => {
        dispatch({ type: 'UPDATE_LAWCHAPTER_PROP', action, value })
      },

      propose:
        draft && !isEditor
          ? () => {
              mockSave({ ...draft, draftingStatus: 'proposal' }).then(() => {
                history.push(ServicePortalPath.RegulationsAdminRoot)
              })
            }
          : undefined,
    }
  }, [
    stepNav,
    // TODO: Review the use of draft here, and remove if possible.
    draft,
    isEditor,
    state,
    draftId,

    history, // NOTE: Should be immutable
    createDraftRegulation, // NOTE: Should be immutable
    updateDraftRegulationById, // NOTE: Should be immutable
    t,
  ])

  return {
    state,
    stepNav,
    actions,
  }
}

// ===========================================================================

export type StepComponent = (props: {
  draft: RegDraftForm
  new?: boolean
  actions: ReturnType<typeof useDraftingState>['actions'] // FIXME: Ick! Ack!
}) => ReturnType<FC>
