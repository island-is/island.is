import { Dispatch, SetStateAction, useCallback } from 'react'
import { useIntl } from 'react-intl'

import { toast } from '@island.is/island-ui/core'
import { errors } from '@island.is/judicial-system-web/messages'
import {
  CivilClaimant,
  CreateCivilClaimantInput,
  // UpdateCivilClaimantInput,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { TempCase as Case } from '@island.is/judicial-system-web/src/types'

import { useCreateCivilClaimantMutation } from './createCivilClaimant.generated'

const useCivilClaimants = () => {
  const { formatMessage } = useIntl()

  const [createCivilClaimantMutation, { loading: isCreatingCivilClaimant }] =
    useCreateCivilClaimantMutation()
  // const [deleteCivilClaimantMutation] = useDeleteCivilClaimantMutation()
  //const [updateCivilClaimantMutation] = useUpdateCivilClaimantMutation()

  const createCivilClaimant = useCallback(
    async (civilClaimant: CreateCivilClaimantInput) => {
      try {
        if (!isCreatingCivilClaimant) {
          const { data } = await createCivilClaimantMutation({
            variables: {
              input: civilClaimant,
            },
          })

          if (data) {
            return data.createCivilClaimant?.id
          }
        }
      } catch (error) {
        toast.error(formatMessage(errors.createDefendant))
      }
    },
    [createCivilClaimantMutation, formatMessage, isCreatingCivilClaimant],
  )

  // const deleteCivilClaimant = useCallback(
  //   async (caseId: string, civilClaimantId: string) => {
  //     try {
  //       const { data } = await deleteCivilClaimantMutation({
  //         variables: { input: { caseId, civilClaimantId } },
  //       })

  //       return Boolean(data?.deleteDefendant?.deleted)
  //     } catch (error) {
  //       toast.error(formatMessage(errors.deleteDefendant))
  //       return false
  //     }
  //   },
  //   [deleteCivilClaimantMutation, formatMessage],
  // )

  // const updateCivilClaimant = useCallback(
  //   async (updateCivilClaimant: UpdateCivilClaimantInput) => {
  //     try {
  //       const { data } = await updateCivilClaimantMutation({
  //         variables: {
  //           input: updateCivilClaimant,
  //         },
  //       })

  //       return Boolean(data)
  //     } catch (error) {
  //       toast.error(formatMessage(errors.updateDefendant))
  //       return false
  //     }
  //   },
  //   [formatMessage, updateCivilClaimantMutation],
  // )

  // const updateCivilClaimantState = useCallback(
  //   (
  //     update: UpdateCivilClaimantInput,
  //     setWorkingCase: Dispatch<SetStateAction<Case>>,
  //   ) => {
  //     setWorkingCase((prevWorkingCase: Case) => {
  //       if (!prevWorkingCase.civilClaimants) {
  //         return prevWorkingCase
  //       }
  //       const indexOfCivilClaimantToUpdate =
  //         prevWorkingCase.civilClaimants.findIndex(
  //           (civilClaimant) => civilClaimant.id === update.civilClaimantId,
  //         )

  //       const newDefendants = [...prevWorkingCase.civilClaimants]

  //       newDefendants[indexOfCivilClaimantToUpdate] = {
  //         ...newDefendants[indexOfCivilClaimantToUpdate],
  //         ...update,
  //       } as CivilClaimant

  //       return { ...prevWorkingCase, defendants: newDefendants }
  //     })
  //   },
  //   [],
  // )

  // const setAndSendCivilClaimantToServer = useCallback(
  //   (
  //     update: UpdateCivilClaimantInput,
  //     setWorkingCase: Dispatch<SetStateAction<Case>>,
  //   ) => {
  //     updateCivilClaimantState(update, setWorkingCase)
  //     updateCivilClaimant(update)
  //   },
  //   [updateCivilClaimant, updateCivilClaimantState],
  // )

  return {
    createCivilClaimant,
    // deleteCivilClaimant,
    // updateCivilClaimant,
    // updateCivilClaimantState,
    //setAndSendCivilClaimantToServer,
  }
}

export default useCivilClaimants
