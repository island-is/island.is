import format from 'date-fns/format'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useMutation } from '@apollo/client'
import {
  Box,
  Button,
  DatePicker,
  DialogPrompt,
  Stack,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import { m } from '../../lib/messages'
import {
  EndorsementList,
  PaginatedEndorsementResponse,
} from '../../types/schema'
import PetitionsTable from '../PetitionsTable'
import {
  CloseList,
  OpenList,
  UnendorseList,
  useGetSingleEndorsement,
  useGetSinglePetition,
  useGetSinglePetitionEndorsements,
} from '../queries'
import Skeleton from '../Skeletons/Skeleton'
import { Modal } from '@island.is/service-portal/core'

const ViewPetitionList = () => {
  const { formatMessage } = useLocale()
  const location: any = useLocation()

  const { petitionData, refetchSinglePetition } = useGetSinglePetition(
    location.state?.listId,
  )
  const petition = petitionData as EndorsementList

  const [closeList, { loading: closeLoading }] = useMutation(CloseList, {
    onCompleted: () => {
      refetchSinglePetition()
    },
  })
  const [openList, { loading: openLoading }] = useMutation(OpenList, {
    onCompleted: () => {
      refetchSinglePetition()
    },
  })

  const viewTypeEdit = location.state?.type === 'edit'
  const userHasSigned = useGetSingleEndorsement(location.state?.listId)
  const [unendorseList, { loading: isLoading }] = useMutation(UnendorseList, {
    onCompleted: () => {
      refetchSinglePetitionEndorsements()
    },
  })

  const [isListOpen, setIsListOpen] = useState(
    new Date() <= new Date(petition?.closedDate),
  )

  const [hasSigned, setHasSigned] = useState(userHasSigned ? true : false)
  const [modalIsOpen] = useState(false)
  const [selectedDateToOpenList, setSelectedDateToOpenList] = useState(
    isListOpen ? new Date(petition?.closedDate) : undefined,
  )

  const {
    petitionEndorsements,
    refetchSinglePetitionEndorsements,
  } = useGetSinglePetitionEndorsements(location.state?.listId)

  useEffect(() => {
    setHasSigned(userHasSigned ? true : false)
    setIsListOpen(new Date() <= new Date(petition?.closedDate))
    setSelectedDateToOpenList(
      isListOpen ? new Date(petition?.closedDate) : undefined,
    )
  }, [userHasSigned, petition, isListOpen])

  const onUnendorse = async () => {
    const success = await unendorseList({
      variables: {
        input: {
          listId: location.state?.listId,
        },
      },
    }).catch(() => {
      toast.error(formatMessage(m.toastErrorOnCloseList))
    })

    if (success) {
      toast.success(formatMessage(m.toastSuccess))
      setHasSigned(false)
    }
  }

  const onCloseList = async () => {
    const success = await closeList({
      variables: {
        input: {
          listId: location.state?.listId,
        },
      },
    }).catch(() => {
      toast.error(formatMessage(m.toastErrorOnCloseList))
    })

    if (success) {
      toast.success(formatMessage(m.toastSuccess))
    }
  }

  const onOpenList = async () => {
    const success = await openList({
      variables: {
        input: {
          listId: location.state?.listId,
          changeEndorsmentListClosedDateDto: {
            closedDate: selectedDateToOpenList,
          },
        },
      },
    }).catch(() => {
      toast.error(formatMessage(m.toastErrorOnOpenList))
    })

    if (success) {
      toast.success(formatMessage(m.toastSuccess))
    }
  }

  return (
    <Box>
      {Object.entries(petition).length !== 0 ? (
        <Box>
          <Stack space={3}>
            <Box>
              <Text variant="h2" marginBottom={2}>
                {petition?.title}
              </Text>
              <Text>{petition?.description?.toString()}</Text>
            </Box>
            <Box
              display={['block', 'flex']}
              justifyContent="spaceBetween"
              width={viewTypeEdit ? 'half' : 'full'}
            >
              {!viewTypeEdit && petition?.closedDate && (
                <Box>
                  <Text variant="h4">{formatMessage(m.listOpenTil)}</Text>
                  <Text variant="default" marginBottom={3}>
                    {format(new Date(petition?.closedDate), 'dd.MM.yyyy')}
                  </Text>
                </Box>
              )}
              <Box>
                <Text variant="h4">{formatMessage(m.listHowManySigned)}</Text>
                <Text variant="default">
                  {
                    (petitionEndorsements as PaginatedEndorsementResponse)
                      .totalCount
                  }
                </Text>
              </Box>
              <Box>
                <Text variant="h4">{formatMessage(m.listOwner)}</Text>
                <Text variant="default">{petition?.ownerName}</Text>
              </Box>
            </Box>
            <Box>
              {!viewTypeEdit && isListOpen && (
                <Box>
                  {hasSigned ? (
                    <Box marginBottom={5} width="half">
                      <DialogPrompt
                        baseId="dialog"
                        title={'Lorem ipsum'}
                        ariaLabel={'Lorem ipsum'}
                        disclosureElement={
                          <Button
                            loading={isLoading}
                            variant="primary"
                            icon="close"
                          >
                            {'Taka nafn mitt af þessum lista'}
                          </Button>
                        }
                        onConfirm={() => onUnendorse()}
                        buttonTextConfirm={'Já'}
                        buttonTextCancel={'Hætta við'}
                      />
                    </Box>
                  ) : (
                    <Box marginBottom={5} width="half">
                      <Button
                        variant="primary"
                        icon="arrowForward"
                        onClick={() =>
                          window.open(
                            `${document.location.origin}/umsoknir/undirskriftalisti/${petition?.meta.applicationId}`,
                          )
                        }
                      >
                        {''}
                      </Button>
                    </Box>
                  )}
                </Box>
              )}
            </Box>
            {viewTypeEdit && (
              <Box>
                {petition?.closedDate && isListOpen && (
                  <Stack space={3}>
                    <Box>
                      <Text variant="h3">{'Breytingar á lista'}</Text>
                      <Text variant="default">
                        {
                          'Hér getur þú breytt lokadagsetningu lista og þannig lengt, stytt eða lokið tímabili hans'
                        }
                      </Text>
                    </Box>

                    <Box display="flex" marginBottom={8} alignItems="center">
                      <DatePicker
                        label="Breyta loka dagsetningu"
                        locale="is"
                        placeholderText="Veldu dagsetningu"
                        selected={selectedDateToOpenList}
                        handleChange={(date) => setSelectedDateToOpenList(date)}
                      />
                      <Box display={'flex'}>
                        <Box marginX={3}>
                          <Button
                            iconType="outline"
                            onClick={() => {
                              onOpenList()
                            }}
                          >
                            {'Uppfæra lista'}
                          </Button>
                        </Box>
                        <Modal
                          id="setDate"
                          isVisible={modalIsOpen}
                          toggleClose={false}
                          initialVisibility={false}
                          disclosure={
                            <Button
                              icon="lockClosed"
                              colorScheme="destructive"
                              variant="ghost"
                              iconType="outline"
                            >
                              {'Ljúka lista'}
                            </Button>
                          }
                        >
                          <Text variant="h1" paddingBottom={3}>
                            {
                              'Ertu viss um að þú viljir ljúka söfnun undirskrifta?'
                            }
                          </Text>
                          <Box
                            marginTop={10}
                            display="flex"
                            justifyContent="spaceBetween"
                          >
                            <Button variant="ghost">Hætta við</Button>
                            <Button
                              onClick={() => onCloseList()}
                              disabled={!selectedDateToOpenList}
                              loading={closeLoading}
                            >
                              Ljúka lista
                            </Button>
                          </Box>
                        </Modal>
                      </Box>
                    </Box>
                  </Stack>
                )}

                {petition?.closedDate && !isListOpen && (
                  <>
                    <Text variant="h3">{'Opna fyrir söfnun undirskrifta'}</Text>
                    <Text variant="default">
                      {
                        'Til að opna fyrir söfnun undirskrifta á ný þarf að velja hnappinn “enduropna lista” hér að neðan.'
                      }
                    </Text>
                    <Box>
                      <Box marginTop={3} marginBottom={8}>
                        <Modal
                          id="setDate"
                          isVisible={modalIsOpen}
                          toggleClose={false}
                          initialVisibility={false}
                          disclosure={
                            <Button icon="reload">{'Enduropna lista'}</Button>
                          }
                        >
                          <Box>
                            <Text variant="h1" paddingBottom={3}>
                              {'Þú ert að fara opna fyrir söfnun undirskrifta'}
                            </Text>
                            <Text paddingBottom={3}>
                              {
                                'Vinsamlegast veldu lokadagsetningu lista, svo hægt sé að opna fyrir söfnun undirskrifta á ný.'
                              }
                            </Text>
                            <DatePicker
                              label={'Dagsetning'}
                              placeholderText={'Veldu dagsetningu'}
                              handleChange={(date) =>
                                setSelectedDateToOpenList(date)
                              }
                            ></DatePicker>
                          </Box>
                          <Box
                            marginTop={10}
                            display="flex"
                            justifyContent="spaceBetween"
                          >
                            <Button variant="ghost">Hætta við</Button>
                            <Button
                              onClick={() => onOpenList()}
                              disabled={!selectedDateToOpenList}
                              loading={openLoading}
                            >
                              Opna lista
                            </Button>
                          </Box>
                        </Modal>
                      </Box>
                    </Box>
                  </>
                )}
              </Box>
            )}
          </Stack>

          <PetitionsTable
            petitions={petitionEndorsements}
            listId={location.state?.listId}
            isViewTypeEdit={viewTypeEdit}
          />
        </Box>
      ) : (
        <Skeleton />
      )}
    </Box>
  )
}

export default ViewPetitionList
