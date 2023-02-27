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
import { CloseList, OpenList, UnendorseList } from '../queries'

import Skeleton from '../Skeletons/Skeleton'
import { Modal } from '@island.is/service-portal/core'
import {
  useGetSingleEndorsement,
  useGetSinglePetition,
  useGetSinglePetitionEndorsements,
} from '../hooks'

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
                            {formatMessage(m.unsignList)}
                          </Button>
                        }
                        onConfirm={() => onUnendorse()}
                        buttonTextConfirm={formatMessage(m.modalButtonYes)}
                        buttonTextCancel={formatMessage(m.modalButtonNo)}
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
                        {formatMessage(m.signList)}
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
                      <Text variant="h3">{formatMessage(m.listChanges)}</Text>
                      <Text variant="default">
                        {formatMessage(m.listChangesDescription)}
                      </Text>
                    </Box>

                    <Box display="flex" marginBottom={8} alignItems="center">
                      <DatePicker
                        label={formatMessage(m.changeCloseDate)}
                        locale="is"
                        placeholderText={formatMessage(m.selectDate)}
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
                            {formatMessage(m.updateList)}
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
                              {formatMessage(m.stopSignatureCollection)}
                            </Button>
                          }
                        >
                          <Text variant="h1" paddingBottom={3}>
                            {formatMessage(m.modalStopCollection)}
                          </Text>
                          <Box
                            marginTop={10}
                            display="flex"
                            justifyContent="spaceBetween"
                          >
                            <Button variant="ghost">
                              {formatMessage(m.modalButtonNo)}
                            </Button>
                            <Button
                              onClick={() => onCloseList()}
                              disabled={!selectedDateToOpenList}
                              loading={closeLoading}
                            >
                              {formatMessage(m.modalButtonYes)}
                            </Button>
                          </Box>
                        </Modal>
                      </Box>
                    </Box>
                  </Stack>
                )}

                {petition?.closedDate && !isListOpen && (
                  <>
                    <Text variant="h3">
                      {formatMessage(m.startSignatureCollection)}
                    </Text>
                    <Text variant="default">
                      {formatMessage(m.startSignatureCollectionDescription)}
                    </Text>
                    <Box>
                      <Box marginTop={3} marginBottom={8}>
                        <Modal
                          id="setDate"
                          isVisible={modalIsOpen}
                          toggleClose={false}
                          initialVisibility={false}
                          disclosure={
                            <Button icon="reload">
                              {formatMessage(m.restartList)}
                            </Button>
                          }
                        >
                          <Box>
                            <Text variant="h1" paddingBottom={3}>
                              {formatMessage(m.modalStartCollection)}
                            </Text>
                            <Text paddingBottom={3}>
                              {formatMessage(m.modalStartCollectionDescription)}
                            </Text>
                            <DatePicker
                              label={formatMessage(m.date)}
                              placeholderText={formatMessage(m.selectDate)}
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
                            <Button variant="ghost">
                              {formatMessage(m.modalButtonNo)}
                            </Button>
                            <Button
                              onClick={() => onOpenList()}
                              disabled={!selectedDateToOpenList}
                              loading={openLoading}
                            >
                              {formatMessage(m.modalButtonYes)}
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
