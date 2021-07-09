import { useQuery } from '@apollo/client'
import {
  HTMLText,
  LawChapterSlug,
  MinistrySlug,
  PlainText,
} from '@island.is/regulations'
import { Query } from '@island.is/api/schema'
import { AuthContextType, useAuth } from '@island.is/auth/react'
import { ServicePortalPath } from '@island.is/service-portal/core'
import { Reducer, useEffect, useReducer } from 'react'
import { produce, setAutoFreeze } from 'immer'
import { useHistory, generatePath } from 'react-router-dom'
import { Step } from '../types'
import { mockDraftRegulations, useMockQuery, mockSave } from '../_mockData'
import { RegulationsAdminScope } from '@island.is/auth/scopes'
import {
  DraftingStatus,
  DraftRegulationCancel,
  DraftRegulationChange,
  RegulationDraft,
  RegulationDraftId,
} from '@island.is/regulations/admin'
import { Kennitala, RegulationType } from '@island.is/regulations'

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
  lawChapters: DraftField<ReadonlyArray<LawChapterSlug>>
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
    appendixes: draft.appendixes.map((appendix) => ({
      title: f(appendix.title),
      text: fHtml(appendix.text),
    })),
    comments: fHtml(draft.comments),

    idealPublishDate: f(
      draft.idealPublishDate && new Date(draft.idealPublishDate),
    ),
    signatureDate: f(draft.signatureDate && new Date(draft.signatureDate)),
    effectiveDate: f(draft.effectiveDate && new Date(draft.effectiveDate)),

    lawChapters: f(draft.lawChapters.map((chapter) => chapter.slug)),
    ministry: f(draft.ministry?.slug),
    type: f(draft.type),

    impacts: draft.impacts.map((impact) =>
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
    authors: f(draft.authors.map((author) => author.authorId)),
  }
  return form
}

const getEmptyDraft = (): RegulationDraft => ({
  id: 0,
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

// type NameValuePair<O extends Record<string, any>> = {
//   [Key in keyof O]: {
//     name: Key
//     value: O[Key]
//   }
// }[keyof O]

type Action =
  | { type: 'CHANGE_STEP'; stepName: Step }
  | { type: 'LOADING_DRAFT' }
  | { type: 'LOADING_DRAFT_SUCCESS'; draft: RegulationDraft }
  | { type: 'LOADING_DRAFT_ERROR'; error: Error }
  | { type: 'SAVING_STATUS' }
  | { type: 'SAVING_STATUS_DONE'; error?: Error }
  // | ({ type: 'UPDATE_PROP' } & NameValuePair<Reg>)
  | { type: 'SHIP' }

type ActionName = Action['type']

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

  // UPDATE_PROP: (state, { name, value }) => {
  //   if (!state.draft) {
  //     return
  //   }
  //   state.draft[name].value = value
  // },

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

  const isNew = draftId === 'new'
  if (stepName === 'review' && !isEditor) {
    throw new Error()
  }

  const [state, dispatch] = useReducer(
    draftingStateReducer,
    { draftId, stepName, isEditor },
    getInitialState,
  )

  const res = useMockQuery(
    draftId !== 'new' &&
      !state.error && { regulationDraft: mockDraftRegulations[draftId] },
    isNew,
  )
  // const res = useQuery<Query>(RegulationDraftQuery, {
  //   variables: { id: draftId },
  //   skip: isNew && !state.error,
  // })
  const { loading, error } = res

  const draft = res.data ? res.data.regulationDraft : undefined

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

  const stepNav = steps[stepName]

  const actions = {
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
            history.push(ServicePortalPath.RegulationsAdminRoot)
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

  return {
    state,
    stepNav,
    actions,
  }
}
