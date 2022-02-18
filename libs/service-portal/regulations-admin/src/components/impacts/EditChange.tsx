import * as s from './Impacts.css'
import { useMutation, gql } from '@apollo/client'
import {
  Button,
  Box,
  Divider,
  GridContainer,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'
import React, { useState } from 'react'
import { DraftChangeForm, RegDraftForm } from '../../state/types'
// import { useDraftingState } from '../../state/useDraftingState'
import { ImpactDate } from './ImpactDate'
import { toISODate } from '@island.is/regulations'
import { LayoverModal } from './LayoverModal'
import { ImpactModalTitle } from './ImpactModalTitle'
import { useGetCurrentRegulationFromApiQuery } from '../../utils/dataHooks'

type EditChangeProp = {
  draft: RegDraftForm
  change: DraftChangeForm
  closeModal: (updateImpacts?: boolean) => void
}

const CREATE_DRAFT_REGULATION_CHANGE = gql`
  mutation CreateDraftRegulationChange(
    $input: CreateDraftRegulationChangeInput!
  ) {
    createDraftRegulationChange(input: $input) {
      id
      type
      name
      regTitle
      date
      title
      text
      appendixes
      comments
    }
  }
`
const UPDATE_DRAFT_REGULATION_CHANGE = gql`
  mutation UpdateDraftRegulationChange(
    $input: UpdateDraftRegulationChangeInput!
  ) {
    updateDraftRegulationChange(input: $input) {
      id
      type
      name
      regTitle
      date
      title
      text
      appendixes
      comments
    }
  }
`

export const EditChange = (props: EditChangeProp) => {
  const { draft, change, closeModal } = props
  const [activeChange, setActiveChange] = useState(change)

  const [createDraftRegulationChange] = useMutation(
    CREATE_DRAFT_REGULATION_CHANGE,
  )
  const [updateDraftRegulationChange] = useMutation(
    UPDATE_DRAFT_REGULATION_CHANGE,
  )

  const {
    data: regulation,
    loading /* , error */,
  } = useGetCurrentRegulationFromApiQuery(change.name)

  const changeDate = (newDate: Date | undefined) => {
    setActiveChange({
      ...activeChange,
      date: { value: newDate },
    })
  }

  const saveChange = () => {
    if (!activeChange.id) {
      createDraftRegulationChange({
        variables: {
          input: {
            changingId: draft.id,
            regulation: activeChange.name,
            title: activeChange.title,
            text: activeChange.title,
            appendixes: activeChange.appendixes.map((apx) => ({
              title: apx.title.value,
              text: apx.text.value,
            })),
            date: toISODate(activeChange.date.value),
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
      updateDraftRegulationChange({
        variables: {
          input: {
            id: activeChange.id,
            title: activeChange.title,
            text: activeChange.title,
            appendixes: activeChange.appendixes.map((apx) => ({
              title: apx.title.value,
              text: apx.text.value,
            })),
            date: toISODate(activeChange.date.value),
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
    <LayoverModal closeModal={closeModal} id="EditChangeModal">
      <GridContainer>
        <GridRow>
          <GridColumn
            span={['12/12', '12/12', '12/12', '8/12']}
            offset={['0', '0', '0', '2/12']}
          >
            <ImpactModalTitle
              type="edit"
              title={change.regTitle}
              name={change.name}
              impact={change}
              onChangeDate={changeDate}
              tag={
                regulation?.type && {
                  second:
                    regulation?.type === 'base'
                      ? 'Stofnreglugerð'
                      : 'Breytingareglugerð',
                }
              }
            />
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
              <Button onClick={saveChange} size="small" icon="arrowForward">
                Vista textabreytingu
              </Button>
            </Box>
          </GridColumn>
        </GridRow>
      </GridContainer>
    </LayoverModal>
  )
}
