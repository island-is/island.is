import { useMutation } from '@apollo/client'
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
import { toISODate } from '@island.is/regulations'
import {
  useGetRegulationFromApiQuery,
  useGetRegulationImpactsQuery,
} from '../../utils/dataHooks'
import { Effects } from '../../types'
import { ImpactHistory } from './ImpactHistory'
import { LayoverModal } from './LayoverModal'
import { ImpactModalTitle } from './ImpactModalTitle'
import {
  CREATE_DRAFT_REGULATION_CANCEL,
  UPDATE_DRAFT_REGULATION_CANCEL,
} from './impactQueries'

type EditCancellationProp = {
  draft: RegDraftForm
  cancellation: DraftCancelForm
  closeModal: (reload?: boolean) => void
}

export const EditCancellation = (props: EditCancellationProp) => {
  const { draft, cancellation, closeModal } = props
  const [activeCancellation, setActiveCancellation] = useState(cancellation)
  const today = toISODate(new Date())

  const { data: regulation } = useGetRegulationFromApiQuery(
    cancellation.name,
    toISODate(cancellation.date.value) ?? undefined,
  )

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

  const [createDraftRegulationCancel] = useMutation(
    CREATE_DRAFT_REGULATION_CANCEL,
  )
  const [updateDraftRegulationCancel] = useMutation(
    UPDATE_DRAFT_REGULATION_CANCEL,
  )

  const { data: draftImpacts } = useGetRegulationImpactsQuery(
    activeCancellation.name,
  )

  const changeCancelDate = (newDate: Date | undefined) => {
    setActiveCancellation({
      ...activeCancellation,
      date: { value: newDate },
    })
  }

  const saveCancellation = async () => {
    if (!cancellation.id) {
      await createDraftRegulationCancel({
        variables: {
          input: {
            date: toISODate(activeCancellation.date.value || today),
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
      await updateDraftRegulationCancel({
        variables: {
          input: {
            id: activeCancellation.id,
            date: toISODate(activeCancellation.date.value || today),
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

  const hasImpactMismatch = () => {
    const impacts = draftImpacts ?? []
    const mismatchArray = impacts.filter(
      (draftImpact) => draftImpact.changingId !== draft.id,
    )
    return mismatchArray.length > 0
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
              impact={activeCancellation}
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
              <ImpactHistory
                effects={effects}
                activeImpact={activeCancellation}
                draftImpacts={draftImpacts}
                draftId={draft.id}
              />
            )}
          </GridColumn>
        </GridRow>
        <GridRow>
          <GridColumn
            span={['12/12', '12/12', '12/12', '10/12', '8/12']}
            offset={['0', '0', '0', '1/12', '2/12']}
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
                disabled={hasImpactMismatch()}
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
