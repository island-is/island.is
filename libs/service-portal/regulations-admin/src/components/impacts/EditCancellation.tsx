import * as s from './Impacts.css'
import { useMutation, gql } from '@apollo/client'
import {
  Text,
  Box,
  Button,
  ModalBase,
  Tag,
  GridContainer,
  GridColumn,
  GridRow,
  Divider,
} from '@island.is/island-ui/core'
import React, { useState } from 'react'
import { DraftCancelForm, RegDraftForm } from '../../state/types'
// import { useDraftingState } from '../../state/useDraftingState'
import { ImpactDate } from './ImpactDate'
import { nameToSlug, RegName } from '@island.is/regulations'
import { ModalHeader } from './ModalHeader'

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
      <Box padding={[3, 3, 3, 6]}>
        <ModalHeader closeModal={closeModal} />
        <GridContainer>
          <GridRow>
            <GridColumn
              span={['12/12', '12/12', '12/12', '6/12']}
              offset={['0', '0', '0', '2/12']}
            >
              <Box paddingY={4}>
                <Box
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  marginBottom={3}
                >
                  <Box marginRight={2}>
                    <Tag>Brottfelling reglugerðar</Tag>
                  </Box>
                  {/* FIXME: get type from service? */}
                  <Tag>Stofnreglugerð</Tag>
                </Box>
                <Text variant="h3" as="h3" marginBottom={[2, 2, 3, 4]}>
                  Fella á brott {cancellation.regTitle}
                </Text>
                <Box marginBottom={[2, 2, 3, 4]}>
                  <Button variant="text" size="small" icon="arrowForward">
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
                </Box>
                <ImpactDate
                  impact={cancellation}
                  size="full"
                  onChange={(newDate) => changeCancelDate(newDate)}
                />
              </Box>
            </GridColumn>
            <GridColumn
              span={['12/12', '12/12', '12/12', '3/12']}
              offset={['0', '0', '0', '1/12']}
            >
              <Box
                background="blueberry100"
                paddingY={3}
                paddingX={4}
                marginTop={10}
              >
                <Text variant="h4" color="blueberry600" marginBottom={3}>
                  Breytingasaga reglugerðar
                </Text>
                <Divider />
                <Text
                  variant="h5"
                  color="blueberry600"
                  paddingTop={3}
                  marginBottom={3}
                >
                  Nýjasta útgáfan
                </Text>
                <Text variant="eyebrow" marginBottom={2}>
                  Væntanlegar breytingar:
                </Text>
                <Text variant="h5" color="blueberry600">
                  380/2020
                </Text>
                <Text variant="small" color="blueberry600" marginBottom={2}>
                  Breytt af 99/2022
                </Text>
                <Text variant="eyebrow" marginBottom={2}>
                  Gildandi breytingar:
                </Text>
                <Text variant="h5" color="blueberry600">
                  449/2019
                </Text>
                <Text variant="small" color="blueberry600" marginBottom={2}>
                  Reglugerð um breytingu á regluggerð nr. 830/2011 um
                  ökuskírteini.
                </Text>
                <Text variant="h5" color="blueberry600">
                  322/2019
                </Text>
                <Text variant="small" color="blueberry600" marginBottom={2}>
                  Reglugerð um breytingu á regluggerð nr. 830/2011 um
                  ökuskírteini.
                </Text>
              </Box>
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
      </Box>
    </ModalBase>
  )
}
