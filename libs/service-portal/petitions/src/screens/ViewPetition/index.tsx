import format from 'date-fns/format'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useMutation } from '@apollo/client'
import {
  AlertMessage,
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

const ViewPetition = () => {
  const { formatMessage } = useLocale()
  const location: any = useLocation()

  const { petitionData, refetchSinglePetition } = useGetSinglePetition(
    location.state?.listId,
  )
  const petition = petitionData as EndorsementList

  const [closeList] = useMutation(CloseList, {
    onCompleted: () => {
      refetchSinglePetition()
    },
  })
  const [openList] = useMutation(OpenList, {
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
                <Box marginTop={3}>
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
                            {'Lorem ipsum'}
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
                      <Text variant="h3">{'Lorem ipsum'}</Text>
                      <Text variant="default">{'Lorem ipsum'}</Text>
                    </Box>

                    <Box display="flex" marginBottom={8}>
                      <DatePicker
                        label="Breyta loka dagsetningu"
                        locale="is"
                        placeholderText="Veldu dagsetningu"
                        selected={selectedDateToOpenList}
                        handleChange={(date) => setSelectedDateToOpenList(date)}
                      />
                      <Box display="flex" alignItems={'center'} width="half">
                        <Box marginX={5}>
                          <Button
                            iconType="outline"
                            onClick={() => {
                              onOpenList()
                            }}
                          >
                            {'Lorem ipsum'}
                          </Button>
                        </Box>
                        <DialogPrompt
                          baseId="demo_dialog"
                          title={''}
                          ariaLabel={''}
                          disclosureElement={
                            <Button
                              icon="lockClosed"
                              iconType="outline"
                              colorScheme="destructive"
                            >
                              {'Ljúka lista'}
                            </Button>
                          }
                          onConfirm={() => onCloseList()}
                          buttonTextConfirm={'Já'}
                          buttonTextCancel={'Hætta við'}
                        />
                      </Box>
                    </Box>
                  </Stack>
                )}

                {petition?.closedDate && !isListOpen && (
                  <>
                    <Text variant="h3">{'Lorem ipsum'}</Text>
                    <Text variant="default">{'Lorem ipsum'}</Text>
                    <Box display={['block', 'flex']} marginY={3}>
                      <Box>
                        <DatePicker
                          label="Velja dagsetningu"
                          locale="is"
                          placeholderText="Veldu dagsetningu"
                          selected={selectedDateToOpenList}
                          required
                          handleChange={(date) =>
                            setSelectedDateToOpenList(date)
                          }
                          size="xs"
                        />
                      </Box>
                      <Box
                        display="flex"
                        alignItems="center"
                        marginLeft={[0, 5]}
                        marginTop={[3, 0]}
                        justifyContent={['flexEnd', 'center']}
                      >
                        <DialogPrompt
                          baseId="demo_dialog"
                          title={'Lorem ipsum'}
                          ariaLabel={'Lorem ipsum'}
                          disclosureElement={
                            <Button
                              icon="reload"
                              iconType="outline"
                              disabled={!selectedDateToOpenList}
                            >
                              {'Lorem ipsum'}
                            </Button>
                          }
                          onConfirm={() => onOpenList()}
                          buttonTextConfirm={'Já'}
                          buttonTextCancel={'Hætta við'}
                        />
                      </Box>
                    </Box>
                    <AlertMessage type="warning" title={''} message="" />
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

export default ViewPetition
