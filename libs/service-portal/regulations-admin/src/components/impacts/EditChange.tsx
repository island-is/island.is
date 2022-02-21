import { useMutation } from '@apollo/client'
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
import { PlainText, toISODate } from '@island.is/regulations'
import { LayoverModal } from './LayoverModal'
import { ImpactModalTitle } from './ImpactModalTitle'
import { useGetCurrentRegulationFromApiQuery } from '../../utils/dataHooks'
import {
  CREATE_DRAFT_REGULATION_CHANGE,
  UPDATE_DRAFT_REGULATION_CHANGE,
} from './impactQueries'
import * as s from './Impacts.css'
import { Appendixes } from '../Appendixes'
import { MagicTextarea } from '../MagicTextarea'
import { MiniDiff } from '../MiniDiff'
import { EditorInput } from '../EditorInput'
import { RegDraftActions, useDraftingState } from '../../state/useDraftingState'

type EditChangeProp = {
  draft: RegDraftForm
  change: DraftChangeForm
  closeModal: (updateImpacts?: boolean) => void
}

export const EditChange = (props: EditChangeProp) => {
  const { draft, change, closeModal } = props
  const [activeChange, setActiveChange] = useState(change)
  const [regulationTitle, setRegulationTitle] = useState(
    activeChange.title.value,
  )

  const [createDraftRegulationChange] = useMutation(
    CREATE_DRAFT_REGULATION_CHANGE,
  )
  const [updateDraftRegulationChange] = useMutation(
    UPDATE_DRAFT_REGULATION_CHANGE,
  )

  const {
    data: regulation,
    loading /* , error */,
  } = useGetCurrentRegulationFromApiQuery(activeChange.name)

  const changeDate = (newDate: Date | undefined) => {
    setActiveChange({
      ...activeChange,
      date: { value: newDate },
    })
  }

  const changeRegulationTitle = (newTitle: string | undefined) => {
    setActiveChange({
      ...activeChange,
      title: { value: newTitle as PlainText }, //TODO: What is the best way to do this is?
    })
  }

  const saveChange = async () => {
    if (!activeChange.id) {
      await createDraftRegulationChange({
        variables: {
          input: {
            changingId: draft.id,
            regulation: activeChange.name,
            title: activeChange.title.value,
            text: activeChange.text.value,
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
      await updateDraftRegulationChange({
        variables: {
          input: {
            id: activeChange.id,
            title: activeChange.title.value,
            text: activeChange.text.value,
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
              title={activeChange.regTitle}
              name={activeChange.name}
              impact={activeChange}
              onChangeDate={changeDate}
              tag={{
                first: 'Textabreyting reglugerðar',
                second: 'Stofnreglugerð',
              }}
            />
          </GridColumn>
          <GridColumn
            span={['12/12', '12/12', '12/12', '8/12']}
            offset={['0', '0', '0', '2/12']}
            paddingBottom={3}
          ></GridColumn>
          <GridColumn
            span={['12/12', '12/12', '12/12', '8/12']}
            offset={['0', '0', '0', '2/12']}
          >
            <Box marginBottom={3}>
              <MagicTextarea
                label="Titill reglugerðar"
                name="title"
                value={activeChange.title.value}
                onChange={(newValue) => changeRegulationTitle(newValue)}
                required
                error={undefined}
              />
              {regulation?.title != null &&
                regulation.title.toString() !== activeChange.title.value && (
                  <MiniDiff
                    older={regulation.title.toString() || ''}
                    newer={activeChange.title.value}
                  />
                )}
            </Box>
            <Box marginBottom={4}>
              <EditorInput
                label="Uppfærður texti"
                baseText={regulation?.text}
                value={activeChange.text.value}
                onChange={(newValue) => console.log(newValue)}
                draftId={draft.id}
                isImpact={true}
                required
                error={undefined}
              />
            </Box>

            {/* VIÐAUKI */}
            {/* <Appendixes
              draftId={draft.id}
              appendixes={change.appendixes}
              actions={}
            /> */}
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
