import { useMutation, useQuery, gql } from '@apollo/client'
import {
  HTMLText,
  LawChapterSlug,
  MinistrySlug,
  PlainText,
} from '@island.is/regulations'
import { Query } from '@island.is/api/schema'
import { AuthContextType, useAuth } from '@island.is/auth/react'
import { ServicePortalPath } from '@island.is/service-portal/core'
import { FC, Reducer, useEffect, useMemo, useReducer } from 'react'
import { produce, setAutoFreeze } from 'immer'
import { useHistory, generatePath } from 'react-router-dom'
import { Step } from '../types'
import { mockDraftRegulations, useMockQuery, mockSave } from '../_mockData'
import { RegulationsAdminScope } from '@island.is/auth/scopes'
import {
  Author,
  DraftingStatus,
  DraftRegulationCancel,
  DraftRegulationChange,
  EmailAddress,
  RegulationDraft,
  RegulationDraftId,
} from '@island.is/regulations/admin'
import { Kennitala, RegulationType } from '@island.is/regulations'
import { uuid } from 'uuidv4'

// const RegulationDraftQuery = gql`
//   query draftRegulations($input: GetDraftRegulationInput!) {
//     getDraftRegulation(input: $input) {
//       draftingStatus
//       getFullName
//       lawChapters
//       appendixes
//       impacts
//       id
//       title
//       text
//       authors
//     }
//   }
// `
const RegulationDraftQuery = gql`
  query draftRegulations($input: GetDraftRegulationInput!) {
    getDraftRegulation(input: $input)
  }
`

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

export type DraftIdFromParam = 'new' | RegulationDraftId

export type StepNav = {
  prev?: Step
  next?: Step
}

export const steps: Record<Step, StepNav> = {
  basics: {
    next: 'meta',
  },
  meta: {
    prev: 'basics',
    next: 'impacts',
  },
  impacts: {
    prev: 'meta',
    next: 'review',
  },
  review: {
    prev: 'impacts',
  },
}

// ---------------------------------------------------------------------------

type DraftFieldExtras = {
  min: Date
  max: Date
}

type DraftField<Type, Extras extends keyof DraftFieldExtras = never> = {
  value: Type
  dirty?: boolean
  error?: string
} & Pick<DraftFieldExtras, Extras>

// TODO: Figure out how the Editor components lazy valueRef.current() getter fits into this
type HtmlDraftField = DraftField<HTMLText>

type BodyDraftFields = {
  title: DraftField<PlainText>
  text: HtmlDraftField
  appendixes: ReadonlyArray<{
    title: DraftField<PlainText>
    text: HtmlDraftField
  }>
  comments: HtmlDraftField
}

type ChangeDraftFields = Readonly<
  // always prefilled on "create" - non-editable
  Pick<DraftRegulationChange, 'id' | 'type' | 'name'>
> & { date: DraftField<Date> } & BodyDraftFields

type CancelDraftFields = Readonly<
  // always prefilled on "create" - non-editable
  Pick<DraftRegulationCancel, 'id' | 'type' | 'name'>
> & { date: DraftField<Date> }

export type RegDraftForm = BodyDraftFields & {
  idealPublishDate: DraftField<Date | undefined>
  signatureDate: DraftField<Date | undefined>
  effectiveDate: DraftField<Date | undefined>
  lawChapters: DraftField<ReadonlyArray<LawChapterSlug> | undefined>
  ministry: DraftField<MinistrySlug | undefined>
  type: DraftField<RegulationType | undefined>

  impacts: ReadonlyArray<ChangeDraftFields | CancelDraftFields>

  readonly draftingStatus: DraftingStatus // non-editable except via saveStatus or propose actions
  draftingNotes: HtmlDraftField
  authors: DraftField<ReadonlyArray<Kennitala>>

  id: RegulationDraft['id']
}

export type DraftingState = {
  isEditor: boolean
  stepName: Step
  savingStatus?: boolean
  loading?: boolean
  error?: Error
  draft?: RegDraftForm
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
    signatureDate: f(draft.signatureDate && new Date(draft.signatureDate)),
    effectiveDate: f(draft.effectiveDate && new Date(draft.effectiveDate)),

    lawChapters: f(draft.lawChapters?.map((chapter) => chapter.slug)),
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
  // id: uuid() as RegulationDraftId,
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

type NameValuePair<O extends Record<string, any>> = {
  [Key in keyof O]: {
    name: Key
    value: O[Key]
  }
}[keyof O]

type RegDraftFormSimpleProps = 'draftingNotes' | 'authors'

type Action =
  | { type: 'CHANGE_STEP'; stepName: Step }
  | { type: 'LOADING_DRAFT' }
  | { type: 'LOADING_DRAFT_SUCCESS'; draft: RegulationDraft }
  | { type: 'LOADING_DRAFT_ERROR'; error: Error }
  | { type: 'SAVING_STATUS' }
  | { type: 'SAVING_STATUS_DONE'; error?: Error }
  | ({ type: 'UPDATE_PROP' } & NameValuePair<
      Pick<RegDraftForm, RegDraftFormSimpleProps>
    >)
  | { type: 'SHIP' }

type ActionName = Action['type']

type UpdateAction = Extract<Action, { type: 'UPDATE_PROP' }>

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

  const [state, dispatch] = useReducer(
    draftingStateReducer,
    { draftId, stepName, isEditor },
    getInitialState,
  )

  const isNew = draftId === 'new'

  // const res = useMockQuery(
  //   draftId !== 'new' &&
  //     !state.error && { regulationDraft: mockDraftRegulations[draftId] },
  //   isNew,
  // )
  // // const res = useQuery<Query>(RegulationDraftQuery, {
  // //   variables: { id: draftId },
  // //   skip: isNew && !state.error,
  // // })
  // const { loading, error } = res

  // const draft = res.data ? res.data.regulationDraft : undefined
  const res = useQuery<Query>(RegulationDraftQuery, {
    variables: {
      input: {
        regulationId: draftId,
      },
    },
    fetchPolicy: 'no-cache',
    skip: isNew && !state.error,
  })

  const { loading, error } = res

  const draft = res.data
    ? (res.data.getDraftRegulation as RegulationDraft)
    : undefined

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

  console.log('----')
  console.log('isNew', isNew)
  console.log('draft', draft)
  console.log('state', state)

  const actions = useMemo(() => {
    const isNew = draftId === 'new'

    return {
      // updateProp: (name: keyof ) => {

      // }

      goBack:
        draft && stepNav.prev
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
        draft && stepNav.next && (isEditor || stepNav.next !== 'review')
          ? () => {
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
            mockSave(draft).then(() => {
              console.log('draft saveStatus', state)
              history.push(ServicePortalPath.RegulationsAdminRoot)
            })
          }
        : () => undefined,
      // FIXME: rename to updateProp??
      updateState: (data: Omit<UpdateAction, 'type'>) => {
        // @ts-expect-error  (FML! FIXME: make this nicer)
        dispatch({ type: 'UPDATE_PROP', ...data })
      },
      createDraft:
        isNew && state.draft
          ? () => {
              createDraftRegulation({
                variables: {
                  input: {
                    id: uuid(),
                    drafting_status: 'draft',
                    title: state.draft?.title.value,
                    text: state.draft?.text.value, // (text + appendix + comments)
                    drafting_notes: '<p>POST test.</p>', // Ritill
                    ministry_id: state.draft?.ministry.value,
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
            }
          : () => undefined,
      updateDraft: state.draft
        ? () => {
            updateDraftRegulationById({
              variables: {
                input: {
                  id: state.draft?.id,
                  body: {
                    title: state.draft?.title?.value,
                    text: state.draft?.text?.value, // (text + appendix + comments)
                    ministryId: state.draft?.ministry?.value,
                    ideal_publish_date: state.draft?.idealPublishDate?.value,
                  },
                },
              },
            }).then((res) => {
              console.log('!!DRAFT UPDATED!! ', res)
            })
          }
        : () => undefined,
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
  actions?: ReturnType<typeof useDraftingState>['actions'] // FIXME: Ick! Ack!
}) => ReturnType<FC>
