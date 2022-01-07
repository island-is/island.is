import React, { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Input,
  Stack,
  DialogPrompt,
  toast,
  AlertMessage,
  DatePicker,
} from '@island.is/island-ui/core'
import { useLocation } from 'react-router-dom'
import {
  useGetSinglePetition,
  LockList,
  UnlockList,
  UpdateList,
  useGetSinglePetitionEndorsements,
} from '../queries'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import PetitionsTable from '../PetitionsTable'
import { EndorsementList } from '../../types/schema'
import { useMutation } from '@apollo/client'
import Skeleton from './Skeleton'

const ViewPetitionAdmin = () => {
  const { formatMessage } = useLocale()
  const location: any = useLocation()
  const { petitionData, refetchSinglePetition } = useGetSinglePetition(
    location.state?.listId,
  )
  const petition = petitionData as EndorsementList
  const { petitionEndorsements } = useGetSinglePetitionEndorsements(
    location.state?.listId,
  )

  const [title, setTitle] = useState(petition?.title)
  const [description, setDescription] = useState(petition?.description)
  const [closedDate, setClosedDate] = useState(petition?.closedDate)
  const [openedDate, setOpenedDate] = useState(petition?.openedDate)

  useEffect(() => {
    setTitle(petition?.title)
    setDescription(petition?.description)
    setClosedDate(petition?.closedDate)
    setOpenedDate(petition?.openedDate)
  }, [petition])

  const [lockList] = useMutation(LockList, {
    onCompleted: () => {
      refetchSinglePetition()
    },
  })

  const [unlockList] = useMutation(UnlockList, {
    onCompleted: () => {
      refetchSinglePetition()
    },
  })

  const [updateList] = useMutation(UpdateList, {
    onCompleted: () => {
      refetchSinglePetition()
    },
  })

  const onLockList = async () => {
    const success = await lockList({
      variables: {
        input: {
          listId: location.state?.listId,
        },
      },
    }).catch(() => {
      toast.error(formatMessage(m.viewPetition.toastErrorLockList))
    })

    if (success) {
      toast.success(formatMessage(m.viewPetition.toastSuccessLockList))
    }
  }

  const onUnlockList = async () => {
    const success = await unlockList({
      variables: {
        input: {
          listId: location.state?.listId,
        },
      },
    }).catch(() => {
      toast.error(formatMessage(m.viewPetition.toastErrorOpenList))
    })

    if (success) {
      toast.success(formatMessage(m.viewPetition.toastSuccessOpenList))
    }
  }

  const onUpdateList = async () => {
    const success = await updateList({
      variables: {
        input: {
          listId: location.state?.listId,
          endorsementList: {
            title: title,
            description: description,
            closedDate: closedDate,
            openedDate: openedDate,
          },
        },
      },
    }).catch(() => {
      toast.error(formatMessage(m.viewPetition.toastErrorOpenList))
    })

    if (success) {
      toast.success(formatMessage(m.viewPetition.toastSuccessOpenList))
    }
  }

  return (
    <Box>
      {Object.entries(petition).length !== 0 ? (
        <Stack space={3}>
          {petition.adminLock && (
            <AlertMessage
              type="error"
              title={formatMessage(m.viewPetition.adminLockedList)}
              message=""
            />
          )}
          <Input
            name={title as string}
            value={title ?? ''}
            onChange={(e) => {
              setTitle(e.target.value)
            }}
            label={formatMessage(m.viewPetition.listTitleHeader)}
            size="xs"
          />
          <Input
            size="xs"
            name={description as string}
            value={description ?? ''}
            onChange={(e) => {
              setDescription(e.target.value)
            }}
            label={formatMessage(m.viewPetition.aboutListHeader)}
            textarea
            rows={10}
          />
          {closedDate && openedDate && (
            <Box display={['block', 'flex']} justifyContent="spaceBetween">
              <Box width="half" marginRight={[0, 2]}>
                <DatePicker
                  selected={new Date(openedDate)}
                  handleChange={(date) => setOpenedDate(date)}
                  label="Tímabil frá"
                  locale="is"
                  placeholderText="Veldu dagsetningu"
                  size="xs"
                />
              </Box>
              <Box width="half" marginLeft={[0, 2]} marginTop={[2, 0]}>
                <DatePicker
                  selected={new Date(closedDate)}
                  handleChange={(date) => setClosedDate(date)}
                  label="Tímabil til"
                  locale="is"
                  placeholderText="Veldu dagsetningu"
                  size="xs"
                />
              </Box>
            </Box>
          )}

          <Input
            size="xs"
            backgroundColor="blue"
            disabled
            name={petition?.ownerName ?? ''}
            value={petition?.ownerName ?? ''}
            label={formatMessage(m.viewPetition.listOwner)}
          />

          <Box
            display="flex"
            justifyContent="spaceBetween"
            marginTop={5}
            marginBottom={7}
          >
            {!petition.adminLock ? (
              <DialogPrompt
                baseId="demo_dialog"
                title={formatMessage(m.viewPetition.dialogPromptLockListTitle)}
                ariaLabel={formatMessage(
                  m.viewPetition.dialogPromptLockListTitle,
                )}
                disclosureElement={
                  <Button
                    icon="lockClosed"
                    iconType="outline"
                    colorScheme="destructive"
                  >
                    {formatMessage(m.viewPetition.LockListButton)}
                  </Button>
                }
                onConfirm={() => onLockList()}
                buttonTextConfirm={formatMessage(
                  m.viewPetition.dialogPromptConfirm,
                )}
                buttonTextCancel={formatMessage(
                  m.viewPetition.dialogPromptCancel,
                )}
              />
            ) : (
              <DialogPrompt
                baseId="demo_dialog"
                title={formatMessage(m.viewPetition.dialogPromptOpenListTitle)}
                ariaLabel={formatMessage(
                  m.viewPetition.dialogPromptOpenListTitle,
                )}
                disclosureElement={
                  <Button icon="reload" iconType="outline">
                    {formatMessage(m.viewPetition.openListTitle)}
                  </Button>
                }
                onConfirm={() => onUnlockList()}
                buttonTextConfirm={formatMessage(
                  m.viewPetition.dialogPromptConfirm,
                )}
                buttonTextCancel={formatMessage(
                  m.viewPetition.dialogPromptCancel,
                )}
              />
            )}
            <DialogPrompt
              baseId="demo_dialog"
              title={formatMessage(m.viewPetition.dialogPromptUpdateListTitle)}
              ariaLabel={formatMessage(
                m.viewPetition.dialogPromptUpdateListTitle,
              )}
              disclosureElement={
                <Button icon="checkmark" iconType="outline">
                  {formatMessage(m.viewPetition.updateListButton)}
                </Button>
              }
              onConfirm={() => onUpdateList()}
              buttonTextConfirm={formatMessage(
                m.viewPetition.dialogPromptConfirm,
              )}
              buttonTextCancel={formatMessage(
                m.viewPetition.dialogPromptCancel,
              )}
            />
          </Box>

          <PetitionsTable
            petitions={petitionEndorsements}
            listId={location.state?.listId}
            isViewTypeEdit={true}
          />
        </Stack>
      ) : (
        <Skeleton />
      )}
    </Box>
  )
}

export default ViewPetitionAdmin
