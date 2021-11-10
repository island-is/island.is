import React, { useState, useEffect } from 'react'
import {
  Text,
  DatePicker,
  Stack,
  AlertMessage,
} from '@island.is/island-ui/core'
import {
  Box,
  Button,
  toast,
  DialogPrompt,
  LoadingDots,
} from '@island.is/island-ui/core'
import { useLocation } from 'react-router-dom'
import {
  useGetSinglePetition,
  UnendorseList,
  useGetSingleEndorsement,
  useGetSinglePetitionEndorsements,
  CloseList,
  OpenList,
} from '../queries'
import { useMutation } from '@apollo/client'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import PetitionsTable from '../PetitionsTable'
import {
  PaginatedEndorsementResponse,
  EndorsementList,
} from '../../types/schema'
import format from 'date-fns/format'

const isLocalhost = window.location.origin.includes('localhost')
const isDev = window.location.origin.includes('beta.dev01.devland.is')
const isStaging = window.location.origin.includes('beta.staging01.devland.is')

const baseUrlForm = isLocalhost
  ? 'http://localhost:4242/umsoknir'
  : isDev
  ? 'https://beta.dev01.devland.is/umsoknir'
  : isStaging
  ? 'https://beta.staging01.devland.is/umsoknir'
  : 'https://island.is/umsoknir'

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
      toast.error(formatMessage(m.viewPetition.toastErrorCloseList))
    })

    if (success) {
      toast.success(formatMessage(m.viewPetition.toastSuccess))
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
      toast.error(formatMessage(m.endorsementForm.errorToast))
    })

    if (success) {
      toast.success(formatMessage(m.viewPetition.toastSuccessCloseList))
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
      toast.error(formatMessage(m.endorsementForm.errorToast))
    })

    if (success) {
      toast.success(formatMessage(m.viewPetition.toastSuccessOpenList))
    }
  }
  console.log(petition?.meta.applicationId)

  return (
    <Box>
      {Object.entries(petition).length !== 0 ? (
        <>
          <Box marginBottom={5}>
            <Text variant="h2" marginBottom={3}>
              {petition?.title}
            </Text>
            <Text variant="default" marginBottom={3}>
              {petition?.description}
            </Text>

            <Box
              display={['block', 'flex']}
              justifyContent="spaceBetween"
              width={viewTypeEdit ? 'half' : 'full'}
            >
              {!viewTypeEdit && petition?.closedDate && (
                <Box>
                  <Text variant="h4">
                    {formatMessage(m.viewPetition.openTil)}
                  </Text>
                  <Text variant="default" marginBottom={3}>
                    {format(new Date(petition?.closedDate), 'dd.MM.yyyy')}
                  </Text>
                </Box>
              )}

              <Box>
                <Text variant="h4">
                  {formatMessage(m.viewPetition.numberSigned)}
                </Text>
                <Text variant="default" marginBottom={3}>
                  {
                    (petitionEndorsements as PaginatedEndorsementResponse)
                      .totalCount
                  }
                </Text>
              </Box>
              <Box>
                <Text variant="h4">
                  {formatMessage(m.viewPetition.listOwner)}
                </Text>
                <Text variant="default" marginBottom={3}>
                  {petition?.ownerName}
                </Text>
              </Box>
            </Box>
          </Box>

          {!viewTypeEdit && isListOpen && (
            <Box marginTop={5}>
              {hasSigned ? (
                <Box marginBottom={5} width="half">
                  <DialogPrompt
                    baseId="dialog"
                    title={formatMessage(
                      m.viewPetition.dialogPromptRemoveNameTitle,
                    )}
                    ariaLabel={formatMessage(
                      m.viewPetition.dialogPromptRemoveNameTitle,
                    )}
                    disclosureElement={
                      <Button
                        loading={isLoading}
                        variant="primary"
                        icon="close"
                      >
                        {formatMessage(m.viewPetition.removeMyPetitionButton)}
                      </Button>
                    }
                    onConfirm={() => onUnendorse()}
                    buttonTextConfirm={formatMessage(
                      m.viewPetition.dialogPromptConfirm,
                    )}
                    buttonTextCancel={formatMessage(
                      m.viewPetition.dialogPromptCancel,
                    )}
                  />
                </Box>
              ) : (
                <Box marginBottom={5} width="half">
                  <Button
                    variant="primary"
                    icon="arrowForward"
                    onClick={() =>
                      window.open(
                        `${baseUrlForm}/medmaelendalisti/${petition?.meta.applicationId}`,
                      )
                    }
                  >
                    {formatMessage(m.viewPetition.signPetitionButton)}
                  </Button>
                </Box>
              )}
            </Box>
          )}

          {viewTypeEdit && (
            <Stack space={7}>
              <Box marginBottom={7}>
                {petition?.closedDate && isListOpen && (
                  <>
                    <Box>
                      <Text variant="h3">
                        {formatMessage(m.viewPetition.updateListTitle)}
                      </Text>
                      <Text variant="default">
                        {formatMessage(m.viewPetition.updateListDescription)}
                      </Text>
                      <Box display="flex" marginTop={3}>
                        <DatePicker
                          label="Breyta loka dagsetningu"
                          locale="is"
                          placeholderText="Veldu dagsetningu"
                          selected={selectedDateToOpenList}
                          handleChange={(date) =>
                            setSelectedDateToOpenList(date)
                          }
                        />
                        <Box display="flex" alignItems="center" marginLeft={5}>
                          <Button
                            icon="checkmark"
                            iconType="outline"
                            onClick={() => {
                              onOpenList()
                            }}
                          >
                            {formatMessage(m.viewPetition.updateListButton)}
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                    <Box marginTop={5}>
                      <Text variant="h3">
                        {formatMessage(m.viewPetition.closeListButton)}
                      </Text>
                      <Text variant="default">
                        {formatMessage(m.viewPetition.closeListDescription)}
                      </Text>
                      <Box marginTop={3}>
                        <DialogPrompt
                          baseId="demo_dialog"
                          title={formatMessage(
                            m.viewPetition.dialogPromptCloseListTitle,
                          )}
                          ariaLabel={formatMessage(
                            m.viewPetition.dialogPromptCloseListTitle,
                          )}
                          disclosureElement={
                            <Button
                              icon="lockClosed"
                              iconType="outline"
                              colorScheme="destructive"
                            >
                              {formatMessage(m.viewPetition.closeListButton)}
                            </Button>
                          }
                          onConfirm={() => onCloseList()}
                          buttonTextConfirm={formatMessage(
                            m.viewPetition.dialogPromptConfirm,
                          )}
                          buttonTextCancel={formatMessage(
                            m.viewPetition.dialogPromptCancel,
                          )}
                        />
                      </Box>
                    </Box>
                  </>
                )}

                {petition?.closedDate && !isListOpen && (
                  <>
                    <Text variant="h3">
                      {formatMessage(m.viewPetition.openListTitle)}
                    </Text>
                    <Text variant="default">
                      {formatMessage(m.viewPetition.openListDescription)}
                    </Text>
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
                          title={formatMessage(
                            m.viewPetition.dialogPromptOpenListTitle,
                          )}
                          ariaLabel={formatMessage(
                            m.viewPetition.dialogPromptCloseListTitle,
                          )}
                          disclosureElement={
                            <Button
                              icon="reload"
                              iconType="outline"
                              disabled={!selectedDateToOpenList}
                            >
                              {formatMessage(m.viewPetition.openListTitle)}
                            </Button>
                          }
                          onConfirm={() => onOpenList()}
                          buttonTextConfirm={formatMessage(
                            m.viewPetition.dialogPromptConfirm,
                          )}
                          buttonTextCancel={formatMessage(
                            m.viewPetition.dialogPromptCancel,
                          )}
                        />
                      </Box>
                    </Box>
                    <AlertMessage
                      type="warning"
                      title={formatMessage(
                        m.viewPetition.alertForSelectingDate,
                      )}
                      message=""
                    />
                  </>
                )}
              </Box>
            </Stack>
          )}

          <PetitionsTable
            petitions={petitionEndorsements}
            listId={location.state?.listId}
            isSendEmailVisible={viewTypeEdit}
          />
        </>
      ) : (
        <Box display="flex" justifyContent="center" marginY={5}>
          <LoadingDots />
        </Box>
      )}
    </Box>
  )
}

export default ViewPetition
