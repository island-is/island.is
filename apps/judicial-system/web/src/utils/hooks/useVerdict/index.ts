import type { Dispatch, SetStateAction } from 'react'
import { useCallback, useContext, useMemo } from 'react'

import {
  type InstitutionUser,
  isDistrictCourtUser,
  isPublicProsecutionOfficeUser,
} from '@island.is/judicial-system/types'
import { UserContext } from '@island.is/judicial-system-web/src/components/UserProvider/UserProvider'
import type {
  Case,
  CreateVerdictsInput,
  Defendant,
  UpdateVerdictInput,
  Verdict,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { toast } from '@island.is/judicial-system-web/src/utils/toast'

import { useCreateVerdictsMutation } from './createVerdicts.generated'
import { useDeliverCaseVerdictMutation } from './deliverCaseVerdict.generated'
import { useUpdateVerdictMutation } from './updateVerdict.generated'
import { useVerdictQuery } from './verdict.generated'

// Mirrors the role rules on GET defendant/:defendantId/verdict. Prosecutors
// and defenders may render VerdictStatusAlert from case data, but must not
// trigger the police sync — the backend rejects them with 403.
const canSyncVerdictFromPolice = (user?: InstitutionUser): boolean =>
  isDistrictCourtUser(user) || isPublicProsecutionOfficeUser(user)

const useVerdict = (currentVerdict?: Verdict) => {
  const { user } = useContext(UserContext)

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

  // Verdict updates can move the case between case tables, so active
  // case table membership queries - the breadcrumbs - must be refetched.
  const [updateVerdictMutation] = useUpdateVerdictMutation({
    refetchQueries: ['CaseTableMembership'],
  })
  const [createVerdictsMutation] = useCreateVerdictsMutation()

  const createVerdicts = async (verdictsToCreate: CreateVerdictsInput) => {
    try {
      const { data } = await createVerdictsMutation({
        variables: {
          input: verdictsToCreate,
        },
      })

      return Boolean(data)
    } catch {
      toast.error('Upp kom villa við að uppfæra mál')
      return false
    }
  }

  const updateVerdict = useCallback(
    async (updateVerdict: UpdateVerdictInput) => {
      try {
        const { data } = await updateVerdictMutation({
          variables: {
            input: updateVerdict,
          },
        })

        return Boolean(data)
      } catch {
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
    !currentVerdict.externalPoliceDocumentId ||
    Boolean(currentVerdict.serviceStatus) ||
    !canSyncVerdictFromPolice(user)
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
      } catch {
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
    createVerdicts,
    deliverCaseVerdict,
    updateDefendantVerdictState,
  }
}

export default useVerdict
