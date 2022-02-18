import * as s from './Impacts.css'
import { useMutation, gql } from '@apollo/client'
import {
  Box,
  Button,
  GridContainer,
  GridColumn,
  GridRow,
  Divider,
} from '@island.is/island-ui/core'
import React, { useMemo, useState } from 'react'
import { DraftCancelForm, RegDraftForm } from '../../state/types'
// import { useDraftingState } from '../../state/useDraftingState'
import { ISODate, toISODate } from '@island.is/regulations'
import { useGetCurrentRegulationFromApiQuery } from '../../utils/dataHooks'
import { Effects } from '../../types'
import { ImpactChangesContainer } from './ImpactChangesContainer'
import { LayoverModal } from './LayoverModal'
import { ImpactModalTitle } from './ImpactModalTitle'

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
      type
      id
      name
      regTitle
      date
    }
  }
`
const UPDATE_DRAFT_REGULATION_CANCEL_IMPACT = gql`
  mutation UpdateDraftRegulationCancel(
    $input: UpdateDraftRegulationCancelInput!
  ) {
    updateDraftRegulationCancel(input: $input) {
      type
      id
      name
      regTitle
      date
    }
  }
`

export const EditCancellation = (props: EditCancellationProp) => {
  const { draft, cancellation, closeModal } = props
  const [activeCancellation, setActiveCancellation] = useState(cancellation)
  const today = new Date().toISOString().substr(0, 10) as ISODate

  const {
    data: regulation,
    loading /* , error */,
  } = useGetCurrentRegulationFromApiQuery(activeCancellation.name)

  const { effects } = useMemo(() => {
    const effects = regulation?.history.reduce<Effects>(
      (obj, item, i) => {
        const arr = item.date > today ? obj.future : obj.past
        arr.push(item)
        return obj
      },
      { past: [], future: [] },
    )

    return {
      effects,
    }
  }, [regulation, today])

  const [createDraftRegulationCancelImpact] = useMutation(
    CREATE_DRAFT_REGULATION_CANCEL_IMPACT,
  )
  const [updateDraftRegulationCancelImpact] = useMutation(
    UPDATE_DRAFT_REGULATION_CANCEL_IMPACT,
  )

  const changeCancelDate = (newDate: Date | undefined) => {
    setActiveCancellation({
      ...activeCancellation,
      date: { value: newDate },
    })
  }

  const saveCancellation = () => {
    if (!cancellation.id) {
      createDraftRegulationCancelImpact({
        variables: {
          input: {
            date: toISODate(activeCancellation.date.value),
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
            date: toISODate(activeCancellation.date.value),
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
    <LayoverModal closeModal={closeModal} id="EditCancelationModal">
      <GridContainer>
        <GridRow>
          <GridColumn
            span={['12/12', '12/12', '12/12', '6/12']}
            offset={['0', '0', '0', '2/12']}
          >
            <ImpactModalTitle
              impact={cancellation}
              name={activeCancellation.name}
              title={activeCancellation.regTitle}
              type={'cancel'}
              tag={
                regulation?.type && {
                  first: 'Brottfelling reglugerðar',
                  second:
                    regulation?.type === 'base'
                      ? 'Stofnreglugerð'
                      : 'Breytingareglugerð',
                }
              }
              onChangeDate={changeCancelDate}
            />
          </GridColumn>
          <GridColumn
            span={['12/12', '12/12', '12/12', '3/12']}
            offset={['0', '0', '0', '1/12']}
          >
            {effects?.future && (
              <ImpactChangesContainer
                effects={effects}
                activeCancellation={activeCancellation}
              />
            )}
          </GridColumn>
        </GridRow>
        <GridRow>
          <GridColumn
            span={['12/12', '12/12', '12/12', '8/12']}
            offset={['0', '0', '0', '2/12']}
          >
            <Box paddingY={5}>
              <Divider />
            </Box>
            <Box
              display="flex"
              justifyContent="spaceBetween"
              alignItems="center"
            >
              <Button
                onClick={() => closeModal()}
                variant="text"
                size="small"
                preTextIcon="arrowBack"
              >
                Til baka
              </Button>
              <Button
                onClick={saveCancellation}
                size="small"
                icon="arrowForward"
              >
                Vista brottfellingu
              </Button>
            </Box>
          </GridColumn>
        </GridRow>
      </GridContainer>
    </LayoverModal>
  )
}
