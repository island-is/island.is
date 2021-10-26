import React, { useState, useEffect } from 'react'
import { DatePicker } from '@island.is/island-ui/core'
import {
  Box,
  Button,
  Input,
  Stack,
  DialogPrompt,
  Text,
  toast,
  AlertMessage,
} from '@island.is/island-ui/core'
import { useLocation } from 'react-router-dom'
import {
  useGetSinglePetition,
  LockList,
  UnlockList,
  UpdateList,
} from '../queries'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import PetitionsTable from '../PetitionsTable'
import { EndorsementList } from '../../types/schema'
import { useMutation } from '@apollo/client'

const ViewPetitionAdmin = () => {
  const { formatMessage } = useLocale()
  const location: any = useLocation()
  const { petitionData, refetchSinglePetition } = useGetSinglePetition(
    location.state?.listId,
  )
  const petition = petitionData as EndorsementList

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
      toast.error(formatMessage(m.viewPetition.toastErrorCloseList))
    })

    if (success) {
      toast.success(formatMessage(m.viewPetition.toastSuccessCloseList))
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
      {Object.entries(petition).length !== 0 && (
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
          />
          <Input
            name={description as string}
            value={description ?? ''}
            onChange={(e) => {
              setDescription(e.target.value)
            }}
            label={formatMessage(m.viewPetition.aboutListHeader)}
            textarea
            rows={10}
          />
          {petition?.closedDate && petition?.openedDate && (
            <Box display={['block', 'flex']} justifyContent="spaceBetween">
              <Box width="half" marginRight={[0, 2]}>
                <DatePicker
                  selected={new Date(petition?.openedDate)}
                  handleChange={(date: Date) => setOpenedDate(date)}
                  label="Tímabil frá"
                  locale="is"
                  placeholderText="Veldu dagsetningu"
                />
              </Box>
              <Box width="half" marginLeft={[0, 2]} marginTop={[2, 0]}>
                <DatePicker
                  selected={new Date(petition?.closedDate)}
                  handleChange={(date: Date) => setClosedDate(date)}
                  label="Tímabil til"
                  locale="is"
                  placeholderText="Veldu dagsetningu"
                />
              </Box>
            </Box>
          )}

          <Input
            backgroundColor="blue"
            disabled
            name={petition?.ownerName}
            value={petition?.ownerName}
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
                title={formatMessage(m.viewPetition.dialogPromptCloseListTitle)}
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
            <Button
              icon="checkmark"
              iconType="outline"
              onClick={() => onUpdateList()}
            >
              {formatMessage(m.viewPetition.updateListButton)}
            </Button>
          </Box>

          <Box>
            <Text variant="h3">
              {formatMessage(m.viewPetition.enorsementsTableTitle)}
            </Text>
            <PetitionsTable />
          </Box>
        </Stack>
      )}
    </Box>
  )
}

export default ViewPetitionAdmin
