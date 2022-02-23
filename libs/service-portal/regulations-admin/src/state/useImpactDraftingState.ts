import React, { useMemo, createContext, useContext, ReactNode } from 'react'
import { useMutation, gql } from '@apollo/client'
import { useHistory } from 'react-router-dom'
import { Step } from '../types'
import { useLocale } from '@island.is/localization'

import {
  AppendixFormSimpleProps,
  AppendixDraftForm,
  DraftingImpactState,
} from './types'
import {} from '@island.is/regulations/web'
import { useEditImpactDraftReducer, ImpactStateInputs } from './reducer'
import { steps } from './makeFields'
import {
  CREATE_DRAFT_REGULATION_CHANGE,
  UPDATE_DRAFT_REGULATION_CHANGE,
} from '../components/impacts/impactQueries'

// ---------------------------------------------------------------------------

export const ensureStepName = (cand: unknown) => {
  if (typeof cand === 'string' && cand in steps) {
    return cand as Step
  }
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

const useMakeImpactDraftingState = (inputs: ImpactStateInputs) => {
  const history = useHistory()
  const t = useLocale().formatMessage

  const [state, dispatch] = useEditImpactDraftReducer(inputs)

  const [deleteDraftRegulationMutation] = useMutation(
    DELETE_DRAFT_REGULATION_MUTATION,
  )
  const [updateDraftRegulationById] = useMutation(
    UPDATE_DRAFT_REGULATION_MUTATION,
  )

  const [createDraftRegulationChange] = useMutation(
    CREATE_DRAFT_REGULATION_CHANGE,
  )
  const [updateDraftRegulationChange] = useMutation(
    UPDATE_DRAFT_REGULATION_CHANGE,
  )
  return useMemo(() => {
    const { impactDraft } = state

    // const saveDraftStatus = (activeChangeId?: DraftRegulationChangeId) => {
    //   return activeChangeId
    //     ? updateDraftRegulationChange({
    //         variables: {
    //           input: {
    //             id: impactDraft.id,
    //             title: impactDraft.title.value,
    //             text: impactDraft.text.value,
    //             appendixes: impactDraft.appendixes.map((apx) => ({
    //               title: apx.title.value,
    //               text: apx.text.value,
    //             })),
    //             date: toISODate(impactDraft.date.value),
    //           },
    //         },
    //       })
    //         .then((res) => {
    //           if (res.errors && res.errors.length > 1) {
    //             throw res.errors[0]
    //           }
    //           return { success: true, error: undefined }
    //         })
    //         .catch((error) => {
    //           return { success: false, error: error as Error }
    //         })
    //     : createDraftRegulationChange({
    //         variables: {
    //           input: {
    //             changingId: impactDraft.id,
    //             regulation: impactDraft.name,
    //             title: impactDraft.title.value,
    //             text: impactDraft.text.value,
    //             appendixes: impactDraft.appendixes.map((apx) => ({
    //               title: apx.title.value,
    //               text: apx.text.value,
    //             })),
    //             date: toISODate(impactDraft.date.value),
    //           },
    //         },
    //       })
    //         .then((res) => {
    //           if (res.errors && res.errors.length > 1) {
    //             throw res.errors[0]
    //           }
    //           return { success: true, error: undefined }
    //         })
    //         .catch((error) => {
    //           return { success: false, error: error as Error }
    //         })
    // }

    const actions = {
      setAppendixProp: <Prop extends AppendixFormSimpleProps>(
        idx: number,
        name: Prop,
        value: AppendixDraftForm[Prop]['value'],
      ) => {
        // @ts-expect-error  (FML! FIXME: make this nicer)
        dispatch({ type: 'IMPACT_APPENDIX_SET_PROP', idx, name, value })
      },

      deleteAppendix: (idx: number) => {
        dispatch({ type: 'IMPACT_APPENDIX_DELETE', idx })
      },

      /**
       * No-op for op-level draft appendixes.
       * Only implemented for action-interface compatilility with
       * impact appendix editing
       */
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      revokeAppendix: (idx: number, revoked: boolean) => undefined,

      moveAppendixUp: (idx: number) => {
        dispatch({ type: 'IMPACT_APPENDIX_MOVE_UP', idx })
      },

      addAppendix: () => {
        console.log('addAppendixState')
        dispatch({ type: 'IMPACT_APPENDIX_ADD' })
      },

      // saveStatus: (
      //   activeChangeId?: DraftRegulationChangeId,
      //   silent?: boolean,
      // ) => {
      //   dispatch({ type: 'IMPACT_SAVING_STATUS' })
      //   saveDraftStatus(activeChangeId).then(({ success, error }) => {
      //     if (success && !silent) {
      //       toast.success(t(buttonsMsgs.saveSuccess))
      //     }
      //     dispatch({
      //       type: 'IMPACT_SAVING_STATUS_DONE',
      //       error: error && { message: buttonsMsgs.saveFailure, error },
      //     })
      //   })
      // },
    }
    return { ...state, actions }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    state,
    dispatch, // NOTE Should be immutable
    history, // NOTE: Should be immutable
    updateDraftRegulationById, // NOTE: Should be immutable
    deleteDraftRegulationMutation, // NOTE: Should be immutable
    t, // NOTE: Should be immutable,
  ])
}

export type RegImpactDraftActions = ReturnType<
  typeof useMakeImpactDraftingState
>['actions']

// ===========================================================================

const RegImpactDraftingContext = createContext(
  {} as DraftingImpactState & { actions: RegImpactDraftActions },
)

type RegImpactDraftingProviderProps = ImpactStateInputs & {
  children: ReactNode
}

export const RegImpactDraftingProvider = (
  props: RegImpactDraftingProviderProps,
) => {
  const { draft, stepName, children } = props

  return React.createElement(RegImpactDraftingContext.Provider, {
    value: useMakeImpactDraftingState({
      draft,
      stepName,
    }),
    children: children,
  })
}

export const useImpactDraftingState = () => useContext(RegImpactDraftingContext)
