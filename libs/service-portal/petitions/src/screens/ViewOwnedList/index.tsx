import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useMutation } from '@apollo/client'
import {
  Box,
  Button,
  Column,
  Columns,
  DatePicker,
  Stack,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'

import { m } from '../../lib/messages'
import PetitionsTable from '../PetitionsTable'
import { CloseList, OpenList } from '../queries'

import Skeleton from '../Skeletons/Skeleton'
import { Modal } from '@island.is/service-portal/core'
import {
  useGetSinglePetition,
  useGetSinglePetitionEndorsements,
} from '../hooks'
import {
  PaginatedEndorsementResponse,
  EndorsementList,
} from '@island.is/api/schema'

const ViewOwnedList = () => {
  useNamespaces('sp.petitions')
  const { formatMessage } = useLocale()
  const { pathname } = useLocation()
  const listId = pathname.replace('/min-gogn/listar/minn-listi/', '')

  const { petitionData, refetchSinglePetition } = useGetSinglePetition(listId)

  const petition = petitionData as EndorsementList

  const [closeList, { loading: closeLoading }] = useMutation(CloseList, {
    onCompleted: () => {
      refetchSinglePetition().then(() => {
        setModalIsOpen(false)
      })
    },
  })
  const [openList, { loading: openLoading }] = useMutation(OpenList, {
    onCompleted: () => {
      refetchSinglePetition().then(() => {
        setModalIsOpen(false)
      })
    },
  })

  const [isListOpen, setIsListOpen] = useState(
    new Date() <= new Date(petition?.closedDate),
  )

  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [selectedDateToOpenList, setSelectedDateToOpenList] = useState(
    isListOpen ? new Date(petition?.closedDate) : undefined,
  )

  const { petitionEndorsements } = useGetSinglePetitionEndorsements(listId)

  useEffect(() => {
    setIsListOpen(new Date() <= new Date(petition?.closedDate))
    setSelectedDateToOpenList(
      isListOpen ? new Date(petition?.closedDate) : undefined,
    )
  }, [petition, isListOpen])

  const onCloseList = async () => {
    const success = await closeList({
      variables: {
        input: {
          listId: listId,
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
          listId: listId,
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
        <>
          <Columns>
            <Column width="11/12">
              <Stack space={2}>
                <Box>
                  <Text variant="h3">{petition?.title}</Text>
                  <Text>{petition?.description as string}</Text>
                </Box>
                <Box
                  display={['block', 'flex']}
                  justifyContent="spaceBetween"
                  width={'half'}
                >
                  <Box>
                    <Text variant="h4">{formatMessage(m.listOwner)}</Text>
                    <Text variant="default">{petition?.ownerName}</Text>
                  </Box>
                  <Box marginTop={[2, 0]}>
                    <Text variant="h4">
                      {formatMessage(m.listHowManySigned)}
                    </Text>
                    <Text variant="default">
                      {
                        (petitionEndorsements as PaginatedEndorsementResponse)
                          .totalCount
                      }
                    </Text>
                  </Box>
                </Box>
              </Stack>
            </Column>
          </Columns>
          <Box marginTop={5} marginBottom={10}>
            {petition?.closedDate && isListOpen && (
              <Stack space={3}>
                <Box>
                  <Text variant="h3">{formatMessage(m.listChanges)}</Text>
                  <Text variant="default">
                    {formatMessage(m.listChangesDescription)}
                  </Text>
                </Box>

                <Box
                  display={['block', 'flex']}
                  marginBottom={8}
                  alignItems="center"
                >
                  <DatePicker
                    appearInline
                    label={formatMessage(m.changeCloseDate)}
                    locale="is"
                    placeholderText={formatMessage(m.selectDate)}
                    selected={selectedDateToOpenList}
                    handleChange={(date) => setSelectedDateToOpenList(date)}
                    minDate={new Date()}
                  />
                  <Box
                    display={'flex'}
                    marginTop={[3, 0]}
                    justifyContent={['spaceBetween']}
                  >
                    <Box marginX={[0, 3]}>
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
                          onClick={() => setModalIsOpen(true)}
                        >
                          {formatMessage(m.stopSignatureCollection)}
                        </Button>
                      }
                    >
                      <Text variant="h1" paddingTop={5}>
                        {formatMessage(m.modalStopCollection)}
                      </Text>
                      <Box
                        marginTop={10}
                        display="flex"
                        justifyContent="spaceBetween"
                      >
                        <Button
                          variant="ghost"
                          onClick={() => setModalIsOpen(false)}
                        >
                          {formatMessage(m.modalButtonNo)}
                        </Button>
                        <Button
                          onClick={() => onCloseList()}
                          disabled={!selectedDateToOpenList}
                          loading={closeLoading}
                        >
                          {formatMessage(m.modalButtonCloseListYes)}
                        </Button>
                      </Box>
                    </Modal>
                  </Box>
                </Box>
              </Stack>
            )}

            {petition?.closedDate && !isListOpen && (
              <Box>
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
                        <Button
                          icon="reload"
                          variant="ghost"
                          onClick={() => setModalIsOpen(true)}
                        >
                          {formatMessage(m.restartList)}
                        </Button>
                      }
                    >
                      <Box>
                        <Text variant="h1" paddingTop={5} paddingBottom={2}>
                          {formatMessage(m.modalStartCollection)}
                        </Text>
                        <Text paddingBottom={3}>
                          {formatMessage(m.modalStartCollectionDescription)}
                        </Text>
                        <DatePicker
                          appearInline
                          label={formatMessage(m.date)}
                          locale="is"
                          minDate={new Date()}
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
                        <Button
                          variant="ghost"
                          onClick={() => setModalIsOpen(false)}
                        >
                          {formatMessage(m.modalButtonNo)}
                        </Button>
                        <Button
                          onClick={() => onOpenList()}
                          disabled={!selectedDateToOpenList}
                          loading={openLoading}
                        >
                          {formatMessage(m.modalButtonOpenListYes)}
                        </Button>
                      </Box>
                    </Modal>
                  </Box>
                </Box>
              </Box>
            )}
          </Box>

          <PetitionsTable
            petition={petition}
            petitionSigners={
              petitionEndorsements as PaginatedEndorsementResponse
            }
            listId={listId}
            canEdit={true}
          />
        </>
      ) : (
        <Skeleton />
      )}
    </Box>
  )
}

export default ViewOwnedList
