import * as s from './Impacts.css'
import { useMutation, gql } from '@apollo/client'
import { Text, Box, Button, ModalBase } from '@island.is/island-ui/core'
import React, { useState } from 'react'
import { DraftCancelForm, RegDraftForm } from '../../state/types'
// import { useDraftingState } from '../../state/useDraftingState'
import { ImpactDate } from './ImpactDate'
import { nameToSlug, RegName } from '@island.is/regulations'

type EditCancellationProp = {
  draft: RegDraftForm
  cancellation: DraftCancelForm
  closeModal: (updateImpacts?: boolean) => void
}

const CREATE_DRAFT_REGULATION_CANCEL_IMPACT = gql`
  mutation CreateDraftRegulationCancel(
    $input: CreateDraftRegulationCancelInput!
  ) {
    createDraftRegulationCancel(input: $input) {
      id
      changingId
      regulation
      date
    }
  }
`
const UPDATE_DRAFT_REGULATION_CANCEL_IMPACT = gql`
  mutation UpdateDraftRegulationCancel(
    $input: UpdateDraftRegulationCancelInput!
  ) {
    updateDraftRegulationCancel(input: $input) {
      id
      changingId
      regulation
      date
    }
  }
`

export const EditCancellation = (props: EditCancellationProp) => {
  const { draft, cancellation, closeModal } = props
  const [activeCancellation, setActiveCancellation] = useState(cancellation)

  const [createDraftRegulationCancelImpact] = useMutation(
    CREATE_DRAFT_REGULATION_CANCEL_IMPACT,
  )
  const [updateDraftRegulationCancelImpact] = useMutation(
    UPDATE_DRAFT_REGULATION_CANCEL_IMPACT,
  )

  const changeCancelDate = (newDate: Date | undefined) => {
    setActiveCancellation({
      ...cancellation,
      date: { value: newDate },
    })
  }

  const saveCancellation = () => {
    if (!cancellation.id) {
      createDraftRegulationCancelImpact({
        variables: {
          input: {
            date: activeCancellation.date.value,
            changingId: draft.id,
            regulation: activeCancellation.name,
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
    } else {
      updateDraftRegulationCancelImpact({
        variables: {
          input: {
            id: activeCancellation.id,
            date: activeCancellation.date,
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
    }
    closeModal(true)
  }

  return (
    <ModalBase
      baseId="EditCancellationModal"
      isVisible={true}
      initialVisibility={true}
      className={s.cancelModal}
      hideOnClickOutside={false} // FIXME: setting this to true disables re-opening the modal
      hideOnEsc={false} // FIXME: setting this to true disables re-opening the modal
      removeOnClose
    >
      <Box padding={4}>
        <Text variant="h3" as="h3" marginBottom={[2, 2, 3, 4]}>
          Fella brott {cancellation.name}
        </Text>
        <Button variant="text">
          <a
            href={
              'https://island.is/reglugerdir/nr/' +
              nameToSlug(cancellation.name as RegName)
            }
            target="_blank"
            rel="noreferrer"
          >
            Skoða breytingasögu reglugerðar
          </a>
        </Button>
        <ImpactDate
          impact={cancellation}
          onChange={(newDate) => changeCancelDate(newDate)}
        />
        <Button onClick={() => closeModal()} variant="text">
          Til baka
        </Button>
        <Button onClick={saveCancellation} variant="text">
          Vista brottfellingu
        </Button>
      </Box>
    </ModalBase>
  )
}

/*

*/
