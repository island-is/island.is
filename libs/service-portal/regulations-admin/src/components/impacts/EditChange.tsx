import * as s from './Impacts.css'
import { useMutation, gql } from '@apollo/client'
import { Text, Box, Button, ModalBase } from '@island.is/island-ui/core'
import React, { useState } from 'react'
import { DraftChangeForm, RegDraftForm } from '../../state/types'
// import { useDraftingState } from '../../state/useDraftingState'
import { ImpactDate } from './ImpactDate'
import { nameToSlug, RegName, toISODate } from '@island.is/regulations'

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
    <ModalBase
      baseId="EditChangeModal"
      isVisible={true}
      initialVisibility={true}
      className={s.changeModal}
      hideOnClickOutside={false} // FIXME: setting this to true disables re-opening the modal
      hideOnEsc={false} // FIXME: setting this to true disables re-opening the modal
      removeOnClose
    >
      <Box padding={4}>
        <Text variant="h3" as="h3" marginBottom={[2, 2, 3, 4]}>
          Textabreyting á {change.regTitle}
        </Text>
        <Button variant="text">
          <a
            href={
              'https://island.is/reglugerdir/nr/' +
              nameToSlug(change.name as RegName)
            }
            target="_blank"
            rel="noreferrer"
          >
            Skoða breytingasögu reglugerðar
          </a>
        </Button>
        <ImpactDate
          impact={change}
          onChange={(newDate) => changeDate(newDate)}
        />
        <Button onClick={() => closeModal()} variant="text">
          Til baka
        </Button>
        <Button onClick={saveChange} variant="text">
          Vista breytingu
        </Button>
      </Box>
    </ModalBase>
  )
}
