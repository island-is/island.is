import { Dispatch, SetStateAction, useCallback } from 'react'
import { useIntl } from 'react-intl'

import { toast } from '@island.is/island-ui/core'
import { errors } from '@island.is/judicial-system-web/messages'
import {
  Case,
  Defendant,
  UpdateVerdictInput,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { useUpdateVerdictMutation } from './updateVerdict.generated'

const useVerdict = () => {
  const { formatMessage } = useIntl()

  const updateDefendantVerdictState = useCallback(
    (
      update: UpdateVerdictInput,
      setWorkingCase: Dispatch<SetStateAction<Case>>,
    ) => {
      setWorkingCase((prevWorkingCase: Case) => {
        if (!prevWorkingCase.defendants) {
          return prevWorkingCase
        }
        const indexOfDefendantToUpdate = prevWorkingCase.defendants.findIndex(
          (defendant) => defendant.id === update.defendantId,
        )

        const newDefendants = prevWorkingCase.defendants

        newDefendants[indexOfDefendantToUpdate] = {
          ...newDefendants[indexOfDefendantToUpdate],
          verdict: update,
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
        toast.error(formatMessage(errors.updateVerdict))
        return false
      }
    },
    [formatMessage, updateVerdictMutation],
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

  return { setAndSendVerdictToServer }
}

export default useVerdict

