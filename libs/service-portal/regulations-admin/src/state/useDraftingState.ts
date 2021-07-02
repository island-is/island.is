import { useQuery } from '@apollo/client'
import { HTMLText } from '@hugsmidjan/regulations-editor/types'
import { Query } from '@island.is/api/schema'
import { AuthContextType, useAuth } from '@island.is/auth/react'
import { ServicePortalPath } from '@island.is/service-portal/core'
import { Reducer, useEffect, useReducer, useState } from 'react'
import { produce, current, setAutoFreeze } from 'immer'
import { useHistory, generatePath } from 'react-router-dom'
import { Step } from '../types'
import { RegulationDraft, DraftRegulationCancel } from '../types-api'
import { RegulationDraftId } from '../types-database'
import { mockDraftRegulations, useMockQuery, mockSave } from '../_mockData'
import { RegulationsAdminScope } from '@island.is/auth/scopes'

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

type Validation = {
  dirty?: boolean
  error?: string
}
type DraftValidation = Record<
  Exclude<
    keyof RegulationDraft,
    'draftingStatus' | 'draftingNotes' | 'id' | 'authors' | 'name'
  >,
  Validation
>

type DraftingState = {
  isEditor: boolean
  stepName: Step
  savingStatus?: boolean
  loading?: boolean
  error?: Error
} & (
  | {
      draft?: RegulationDraft
      impacts?: Array<DraftRegulationCancel>
      valid?: DraftValidation
    }
  | {
      draft?: undefined
      impacts?: undefined
      valid?: undefined
    }
)

// ---------------------------------------------------------------------------

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
})

const getEmptyValidation = (): DraftValidation => ({
  title: {},
  text: {},
  appendixes: {},
  comments: {},
  idealPublishDate: {},
  signatureDate: {},
  effectiveDate: {},
  type: {},
  lawChapters: {},
  ministry: {},
})

// ---------------------------------------------------------------------------

const validate = (state: DraftingState): DraftValidation => {
  // TODO:
  return getEmptyValidation()
}

const validateSingle = <Field extends keyof RegulationDraft>(
  state: DraftingState,
  name: Field,
  value: RegulationDraft[Field],
): DraftValidation => {
  // TODO:
  return getEmptyValidation()
}

// ---------------------------------------------------------------------------

type Action =
  | { type: 'CHANGE_STEP'; stepName: Step }
  | { type: 'LOADING_DRAFT' }
  | { type: 'LOADING_DRAFT_SUCCESS'; draft: RegulationDraft }
  | { type: 'LOADING_DRAFT_ERROR'; error: Error }
  | { type: 'SAVING_STATUS' }
  | { type: 'SAVING_STATUS_DONE'; error?: Error }
  | { type: 'UPDATE_PROP'; name: keyof RegulationDraft; value: any } // FIXME
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
    state.draft = draft
    state.valid = validate(state)
  },
  LOADING_DRAFT_ERROR: (state, { error }) => {
    state.loading = false
    state.error = error
    state.draft = undefined
    state.valid = undefined
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
    // @ts-expect-error  (FIXME:)
    state.draft[name] = value
    state.valid = validateSingle(state, name, value)
  },

  SHIP: (state) => {
    if (!state.isEditor) {
      return {
        ...state,
        error: new Error('Must be an editor'),
      }
    }
    return {
      ...state,
      loading: true,
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
      draft: getEmptyDraft(),
      valid: getEmptyValidation(),
      impacts: [],
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
  const isEditor = useAuth().userInfo?.scopes?.includes(RegulationsAdminScope.manage) || false;

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
