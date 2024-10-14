import {
  createElement,
  useEffect,
  useMemo,
  createContext,
  useContext,
  ReactNode,
} from 'react'
import { useMutation, gql } from '@apollo/client'
import { LawChapterSlug, PlainText, toISODate } from '@island.is/regulations'
import { useNavigate } from 'react-router-dom'
import { RegulationDraftTypes, Step, StepNames } from '../types'
import { useLocale } from '@island.is/localization'
import { DraftingStatus } from '@island.is/regulations/admin'
import {
  RegDraftForm,
  DraftingState,
  RegDraftFormSimpleProps,
  AppendixFormSimpleProps,
  AppendixDraftForm,
} from './types'
import { buttonsMsgs } from '../lib/messages'
import {} from '@island.is/regulations/web'
import { getEditUrl, getHomeUrl } from '../utils/routing'
import { useEditDraftReducer, StateInputs } from './reducer'
import { stepsBase } from './makeFields'
import {
  isDraftErrorFree,
  isDraftLocked,
  isDraftPublishable,
} from './validations'
import { toast } from 'react-toastify'
import { findRegulationType } from '../utils/guessers'

// ---------------------------------------------------------------------------

export const ensureStepName = (cand: unknown) => {
  if (typeof cand === 'string' && cand in stepsBase) {
    return cand as Step
  } else {
    return undefined
  }
}

const isDraftEmpty = (draft: RegDraftForm): boolean => {
  const someContent =
    draft.title.value ||
    draft.text.value ||
    draft.appendixes.some(({ text, title }) => title.value || text.value) ||
    draft.impacts['length']

  return !someContent
}

// ---------------------------------------------------------------------------

const UPDATE_DRAFT_REGULATION_MUTATION = gql`
  mutation UpdateDraftRegulationMutation($input: EditDraftRegulationInput!) {
    updateDraftRegulationById(input: $input)
  }
`
const DELETE_DRAFT_REGULATION_MUTATION = gql`
  mutation DeleteDraftRegulationMutation($input: DeleteDraftRegulationInput!) {
    deleteDraftRegulation(input: $input) {
      id
    }
  }
`

// ---------------------------------------------------------------------------

const useMakeDraftingState = (inputs: StateInputs) => {
  const navigate = useNavigate()
  const t = useLocale().formatMessage

  const [state, dispatch] = useEditDraftReducer(inputs)

  // NOTE: we assume that both input.draft nad input.ministries don't change
  // so we don't have an effect hook that checks for them changing....

  const draftIsLocked = isDraftLocked(state.draft)

  useEffect(() => {
    if (
      draftIsLocked &&
      inputs.stepName !== StepNames.review &&
      inputs.stepName !== StepNames.publish
    ) {
      navigate(getEditUrl(StepNames.review), {
        replace: true,
      })
    } else {
      dispatch({ type: 'CHANGE_STEP', stepName: inputs.stepName })
    }
  }, [
    inputs.stepName,
    draftIsLocked,
    navigate, // NOTE: Should be immutable
    dispatch, // NOTE: Should be immutable
  ])

  useEffect(() => {
    dispatch({ type: 'SET_IMPACT', impactId: inputs.activeImpact })
  }, [
    inputs.activeImpact,
    dispatch, // NOTE: Should be immutable
  ])

  const [deleteDraftRegulationMutation] = useMutation(
    DELETE_DRAFT_REGULATION_MUTATION,
  )
  const [updateDraftRegulationById] = useMutation(
    UPDATE_DRAFT_REGULATION_MUTATION,
  )

  return useMemo(() => {
    const { draft, step } = state
    const nextStep = step.next
    const prevStep = step.prev

    const saveDraftStatus = (newStatus?: DraftingStatus) =>
      updateDraftRegulationById({
        variables: {
          input: {
            id: draft.id,
            body: {
              name: draft.name.value,
              title: draft.title.value,
              text: draft.text.value,
              appendixes: draft.appendixes.map((apx) => ({
                title: apx.title.value,
                text: apx.text.value,
              })),
              comments: '',
              ministry: draft.ministry.value,
              draftingNotes: draft.draftingNotes.value,
              idealPublishDate: toISODate(draft.idealPublishDate?.value),
              fastTrack: draft.fastTrack.value,
              lawChapters: draft.lawChapters.value,
              signatureDate: toISODate(draft.signatureDate.value),
              signatureText: draft.signatureText.value,
              effectiveDate: toISODate(draft.effectiveDate.value),
              type: draft.type.value,
              draftingStatus: newStatus || draft.draftingStatus,
              signedDocumentUrl: draft.signedDocumentUrl.value,
            },
          },
        },
      })
        .then((res) => {
          if (res.errors && res.errors.length > 1) {
            throw res.errors[0]
          }
          return { success: true, error: undefined }
        })
        .catch((error) => {
          return { success: false, error: error as Error }
        })

    const actions = {
      goBack: prevStep
        ? () => {
            actions.goToStep(prevStep)
          }
        : undefined,

      goForward: nextStep
        ? () => {
            // BASICS – It's pointless (albeit harmless) to go forward if title and text are empty
            if (
              step.name === StepNames.basics &&
              (draft.title.error || draft.text.error)
            ) {
              // trigger dirty=true on both title and text
              !draft.title.dirty &&
                actions.updateState('title', draft.title.value)
              !draft.text.dirty && actions.updateState('text', draft.text.value)
              return // Prevent the user going forward
            }

            const isTitleAmending =
              findRegulationType(draft.title.value) ===
              RegulationDraftTypes.amending

            const amendingTitleAndBaseType =
              isTitleAmending && draft.type.value === RegulationDraftTypes.base

            const baseTitleAndAmendingType =
              !isTitleAmending &&
              draft.type.value === RegulationDraftTypes.amending
            if (
              step.name === StepNames.basics &&
              (amendingTitleAndBaseType || baseTitleAndAmendingType)
            ) {
              return // Prevent the user going forward
            }

            const isTitleTooLong = draft.title.value.length > 1024
            if (isTitleTooLong) {
              return // Prevent the user going forward
            }

            actions.goToStep(nextStep)
          }
        : undefined,

      goToStep: async (stepName: Step) => {
        if (!isDraftEmpty(draft)) {
          await actions.saveStatus(true)
        }
        navigate(getEditUrl(draft.id, stepName))
      },

      updateState: <Prop extends RegDraftFormSimpleProps>(
        name: Prop,
        value: RegDraftForm[Prop]['value'],
      ) => {
        // @ts-expect-error  (For some reason typescript is not detecting the correct types here)
        dispatch({ type: 'UPDATE_PROP', name, value })
      },

      setAppendixProp: <Prop extends AppendixFormSimpleProps>(
        idx: number,
        name: Prop,
        value: AppendixDraftForm[Prop]['value'],
      ) => {
        // @ts-expect-error  (For some reason typescript is not detecting the correct types here)
        dispatch({ type: 'APPENDIX_SET_PROP', idx, name, value })
      },

      deleteAppendix: (idx: number) => {
        dispatch({ type: 'APPENDIX_DELETE', idx })
      },

      /**
       * No-op for op-level draft appendixes.
       * Only implemented for action-interface compatilility with
       * impact appendix editing
       */
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      revokeAppendix: (idx: number, revoked: boolean) => undefined,

      moveAppendixUp: (idx: number) => {
        dispatch({ type: 'APPENDIX_MOVE_UP', idx })
      },

      moveAppendixDown: (idx: number) => {
        dispatch({ type: 'APPENDIX_MOVE_DOWN', idx })
      },

      addAppendix: () => {
        dispatch({ type: 'APPENDIX_ADD' })
      },

      setMinistry: (value?: PlainText) => {
        dispatch({ type: 'SET_MINISTRY', value })
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
            toast.info(t(buttonsMsgs.hasBeenDeleted))
            navigate(getHomeUrl())
          })
        } catch (e) {
          console.error('Failed to delete regulation draft: ', e)
          return
        }
      },

      closeDraft: async () => {
        if (isDraftEmpty(draft)) {
          await actions.deleteDraft()
        }
        navigate(getHomeUrl())
      },

      saveStatus: async (silent?: boolean, andClose?: boolean) => {
        if (isDraftLocked(draft)) {
          return false
        }
        dispatch({ type: 'SAVING_STATUS' })
        await saveDraftStatus().then(({ success, error }) => {
          if (success && !silent) {
            toast.success(t(buttonsMsgs.saveSuccess))
          }
          dispatch({
            type: 'SAVING_STATUS_DONE',
            error: error && { message: buttonsMsgs.saveFailure, error },
          })
        })
        if (andClose) {
          navigate(getHomeUrl())
        }
        return true
      },

      propose: !state.isEditor
        ? async () => {
            if (isDraftLocked(draft)) {
              return false
            }
            dispatch({ type: 'SAVING_STATUS' })
            await saveDraftStatus('proposal').then(({ success, error }) => {
              if (error) {
                dispatch({
                  type: 'SAVING_STATUS_DONE',
                  error: { message: buttonsMsgs.saveFailure, error },
                })
              } else {
                navigate(getHomeUrl())
              }
            })
            return true
          }
        : undefined,

      ship:
        state.isEditor &&
        // only offer shipping from "review" step
        state.step.name === StepNames.review
          ? async () => {
              if (!isDraftErrorFree(state)) {
                return false
              }
              dispatch({ type: 'SAVING_STATUS' })
              await saveDraftStatus('shipped').then(({ success, error }) => {
                if (error) {
                  dispatch({
                    type: 'SAVING_STATUS_DONE',
                    error: { message: buttonsMsgs.saveFailure, error },
                  })
                } else {
                  navigate(getHomeUrl())
                }
              })
              return true
            }
          : undefined,

      publish:
        state.isEditor &&
        // only offer publish from "publish" step
        state.step.name === StepNames.publish
          ? async () => {
              if (!isDraftPublishable(state)) {
                return false
              }
              dispatch({ type: 'SAVING_STATUS' })
              await saveDraftStatus('published').then(({ success, error }) => {
                if (error) {
                  dispatch({
                    type: 'SAVING_STATUS_DONE',
                    error: { message: buttonsMsgs.saveFailure, error },
                  })
                } else {
                  navigate(getHomeUrl())
                }
              })
              return true
            }
          : undefined,
    }
    return { ...state, actions }
  }, [
    state,

    dispatch, // NOTE Should be immutable
    navigate, // NOTE: Should be immutable
    updateDraftRegulationById, // NOTE: Should be immutable
    deleteDraftRegulationMutation, // NOTE: Should be immutable
    t, // NOTE: Should be immutable,
  ])
}

export type RegDraftActions = ReturnType<typeof useMakeDraftingState>['actions']

// ===========================================================================

// ===========================================================================

const RegDraftingContext = createContext(
  {} as DraftingState & { actions: RegDraftActions },
)

type RegDraftingProviderProps = StateInputs & {
  children: ReactNode
}

export const RegDraftingProvider = (props: RegDraftingProviderProps) => {
  const {
    regulationDraft,
    activeImpact,
    ministries,
    lawChapters,
    stepName,
    children,
  } = props

  return createElement(RegDraftingContext.Provider, {
    value: useMakeDraftingState({
      regulationDraft,
      activeImpact,
      ministries,
      lawChapters,
      stepName,
    }),
    children: children,
  })
}

export const useDraftingState = () => useContext(RegDraftingContext)
