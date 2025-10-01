import { Dispatch, SetStateAction, useCallback, useMemo } from 'react'

import { toast } from '@island.is/island-ui/core'
import {
  Case,
  Defendant,
  UpdateVerdictInput,
  Verdict,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { useDeliverCaseVerdictMutation } from './deliverCaseVerdict.generated'
import { useUpdateVerdictMutation } from './updateVerdict.generated'
import { useVerdictQuery } from './verdict.generated'

const useVerdict = (currentVerdict?: Verdict) => {
  const updateDefendantVerdictState = useCallback(
    (
      update: UpdateVerdictInput,
      setWorkingCase: Dispatch<SetStateAction<Case>>,
    ) => {
      setWorkingCase((prevWorkingCase: Case) => {
        if (!prevWorkingCase.defendants) {
          return prevWorkingCase
        }
        const { defendantId, ...verdictFields } = update
        const indexOfDefendantToUpdate = prevWorkingCase.defendants.findIndex(
          (defendant) => defendant.id === defendantId,
        )

        const newDefendants = [...prevWorkingCase.defendants]

        const currentVerdict = newDefendants[indexOfDefendantToUpdate].verdict
        newDefendants[indexOfDefendantToUpdate] = {
          ...newDefendants[indexOfDefendantToUpdate],
          verdict: { ...currentVerdict, ...verdictFields },
        } as Defendant

        return { ...prevWorkingCase, defendants: newDefendants }
      })
    },
    [],
  )

  const [updateVerdictMutation] = useUpdateVerdictMutation()

  const updateVerdict = useCallback(
    async (updateVerdict: UpdateVerdictInput) => {
      try {
        const { data } = await updateVerdictMutation({
          variables: {
            input: updateVerdict,
          },
        })

        return Boolean(data)
      } catch (error) {
        toast.error('Upp kom villa við að uppfæra dóm')
        return false
      }
    },
    [updateVerdictMutation],
  )

  const setAndSendVerdictToServer = useCallback(
    (
      update: UpdateVerdictInput,
      setWorkingCase: Dispatch<SetStateAction<Case>>,
    ) => {
      updateDefendantVerdictState(update, setWorkingCase)
      updateVerdict(update)
    },
    [updateDefendantVerdictState, updateVerdict],
  )

  const skip =
    !currentVerdict ||
    !currentVerdict?.externalPoliceDocumentId ||
    Boolean(currentVerdict?.serviceStatus)
  const {
    data,
    loading: verdictLoading,
    error,
  } = useVerdictQuery({
    skip,
    variables: {
      input: {
        caseId: currentVerdict?.caseId ?? '',
        defendantId: currentVerdict?.defendantId ?? '',
      },
    },
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  const [deliverCaseVerdictMutation] = useDeliverCaseVerdictMutation()

  const deliverCaseVerdict = useMemo(
    () => async (caseId: string) => {
      try {
        const result = await deliverCaseVerdictMutation({
          variables: { input: { caseId } },
        })
        return result.data?.deliverCaseVerdict?.queued ?? false
      } catch (error) {
        toast.error('Upp kom villa við senda dóm í birtingu')
        return false
      }
    },
    [deliverCaseVerdictMutation],
  )

  return {
    verdict: skip || error ? currentVerdict : data?.verdict,
    verdictLoading: skip ? false : verdictLoading,
    setAndSendVerdictToServer,
    deliverCaseVerdict,
  }
}

export default useVerdict
