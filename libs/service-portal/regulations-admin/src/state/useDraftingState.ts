import React, {
  useEffect,
  useMemo,
  createContext,
  useContext,
  ReactNode,
} from 'react'
import { useMutation, gql } from '@apollo/client'
import { LawChapterSlug, MinistryList } from '@island.is/regulations'
import { useHistory } from 'react-router-dom'
import { Step } from '../types'
import { getInputFieldsWithErrors, useLocale } from '../utils'
import { DraftingStatus, RegulationDraft } from '@island.is/regulations/admin'
import {
  RegDraftForm,
  DraftingState,
  RegDraftFormSimpleProps,
  AppendixFormSimpleProps,
  AppendixDraftForm,
} from './types'
import { buttonsMsgs } from '../messages'
import {} from '@island.is/regulations/web'
import { toast } from '@island.is/island-ui/core'
import { getEditUrl, getHomeUrl } from '../utils/routing'
import { useEditDraftReducer, StateInputs } from './reducer'

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
  const history = useHistory()
  const t = useLocale().formatMessage

  const [state, dispatch] = useEditDraftReducer(inputs)

  // NOTE: we assume that both input.draft nad input.ministries don't change

  useEffect(
    () => dispatch({ type: 'CHANGE_STEP', stepName: inputs.stepName }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [inputs.stepName],
  )

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
              title: draft.title.value,
              text: draft.text.value,
              appendixes: draft.appendixes.map((apx) => ({
                title: apx.title.value,
                text: apx.text.value,
              })),
              comments: draft.comments.value,
              ministry: draft.ministry.value,
              draftingNotes: draft.draftingNotes.value,
              idealPublishDate: draft.idealPublishDate?.value,
              fastTrack: draft.fastTrack.value,
              lawChapters: draft.lawChapters.value,
              signatureDate: draft.signatureDate.value,
              signatureText: draft.signatureText.value,
              effectiveDate: draft.effectiveDate.value,
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
      goBack: prevStep ? () => actions.goToStep(prevStep) : undefined,

      goForward:
        nextStep && (state.isEditor || nextStep !== 'review')
          ? () => {
              // BASICS
              if (step.name === 'basics') {
                const errorFields = getInputFieldsWithErrors(
                  ['title', 'text'],
                  draft,
                )

                if (errorFields) {
                  dispatch({
                    type: 'UPDATE_MULTIPLE_PROPS',
                    multiData: errorFields,
                  })
                  return // Prevent the user going forward
                }
              }

              actions.goToStep(nextStep)
            }
          : undefined,

      goToStep: (stepName: Step) => {
        actions.saveStatus(true)
        history.push(getEditUrl(draft.id, stepName))
      },

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
            history.push(getHomeUrl())
          })
        } catch (e) {
          console.error('Failed to delete regulation draft: ', e)
          return
        }
      },

      saveStatus: (silent?: boolean) => {
        dispatch({ type: 'SAVING_STATUS' })
        saveDraftStatus().then(({ success, error }) => {
          if (error) {
            toast.error(t(buttonsMsgs.saveFailure))
            console.error(error)
          } else if (!silent) {
            toast.success(t(buttonsMsgs.saveSuccess))
          }
          dispatch({ type: 'SAVING_STATUS_DONE', error })
        })
      },

      propose: !state.isEditor
        ? () => {
            dispatch({ type: 'SAVING_STATUS' })
            saveDraftStatus('proposal').then(({ success, error }) => {
              if (error) {
                toast.error(t(buttonsMsgs.saveFailure))
                console.error(error)
                dispatch({ type: 'SAVING_STATUS_DONE', error })
              } else {
                history.push(getHomeUrl())
              }
            })
          }
        : undefined,
    }
    return { ...state, actions }
    // // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    state,

    dispatch, // NOTE Should be immutable
    history, // NOTE: Should be immutable
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

type RegDraftingProviderProps = {
  regulationDraft: RegulationDraft
  stepName: Step
  ministries: MinistryList
  children: ReactNode
}

export const RegDraftingProvider = (props: RegDraftingProviderProps) => {
  const { regulationDraft, ministries, stepName, children } = props

  return React.createElement(RegDraftingContext.Provider, {
    value: useMakeDraftingState({
      regulationDraft,
      ministries,
      stepName,
    }),
    children: children,
  })
}

export const useDraftingState = () => useContext(RegDraftingContext)
