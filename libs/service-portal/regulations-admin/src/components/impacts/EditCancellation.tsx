import * as s from './Impacts.css'
import { useMutation, gql } from '@apollo/client'
import { format } from 'date-fns' // eslint-disable-line no-restricted-imports
import { is } from 'date-fns/locale' // eslint-disable-line no-restricted-imports
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
import React, { useMemo, useState } from 'react'
import { DraftCancelForm, RegDraftForm } from '../../state/types'
// import { useDraftingState } from '../../state/useDraftingState'
import { ImpactDate } from './ImpactDate'
import { ModalHeader } from './ModalHeader'
import {
  ISODate,
  nameToSlug,
  RegName,
  RegulationHistoryItem,
  toISODate,
} from '@island.is/regulations'
import { useGetCurrentRegulationFromApiQuery } from '../../utils/dataHooks'
import { date } from 'zod'
import {
  CREATE_DRAFT_REGULATION_CANCEL,
  UPDATE_DRAFT_REGULATION_CANCEL,
} from './impactQueries'

type EditCancellationProp = {
  draft: RegDraftForm
  cancellation: DraftCancelForm
  closeModal: (updateImpacts?: boolean) => void
}

type Effects = Record<'past' | 'future', Array<RegulationHistoryItem>>
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

  const [createDraftRegulationCancel] = useMutation(
    CREATE_DRAFT_REGULATION_CANCEL,
  )
  const [updateDraftRegulationCancel] = useMutation(
    UPDATE_DRAFT_REGULATION_CANCEL,
  )

  const changeCancelDate = (newDate: Date | undefined) => {
    setActiveCancellation({
      ...activeCancellation,
      date: { value: newDate },
    })
  }

  const saveCancellation = () => {
    if (!cancellation.id) {
      createDraftRegulationCancel({
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
      updateDraftRegulationCancel({
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
                    <Tag disabled>Brottfelling reglugerðar</Tag>
                  </Box>
                  {regulation?.type && (
                    <Tag disabled>
                      {regulation?.type === 'base'
                        ? 'Stofnreglugerð'
                        : 'Breytingareglugerð'}
                    </Tag>
                  )}
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
                  impact={activeCancellation}
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
                  <a
                    href={`https://island.is/reglugerdir/nr/${nameToSlug(
                      activeCancellation.name as RegName,
                    )}`}
                    // 'FIXME: target="_blank" is not working here?
                    target="_blank"
                    rel="noreferrer"
                  >
                    Nýjasta útgáfan
                  </a>
                </Text>
                {effects?.future && effects.future.length > 0 ? (
                  <>
                    <Text variant="eyebrow" marginBottom={2}>
                      Væntanlegar breytingar:
                    </Text>
                    {effects?.future.map((effect) => (
                      <>
                        <Text variant="h5" color="blueberry600">
                          {format(new Date(effect.date), 'd. MMM yyyy', {
                            locale: is,
                          })}
                        </Text>
                        <Text
                          variant="small"
                          color="blueberry600"
                          marginBottom={2}
                        >
                          <a
                            href={`https://island.is/reglugerdir/nr/${nameToSlug(
                              activeCancellation.name as RegName,
                            )}/d/${effect.date}/diff`}
                            // 'FIXME: target="_blank" is not working here?
                            target="_blank"
                            rel="noreferrer"
                          >
                            Breytt af {effect.name}
                          </a>
                        </Text>
                      </>
                    ))}
                  </>
                ) : (
                  <Text variant="h5" marginBottom={2}>
                    Engar breytingar framundan
                  </Text>
                )}
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
