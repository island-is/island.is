import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Input,
  Stack,
  AlertMessage,
  DatePicker,
  toast,
} from '@island.is/island-ui/core'
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
  useRevalidator,
} from 'react-router-dom'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import Skeleton from '../../components/ListSkeleton'
import ListSignersTable from '../../components/ListSignersTable'
import { UpdateListMutation } from '../../components/ListActions/UpdateList/updateList.generated'
import { LockList } from '../../components/ListActions/LockList'
import { UnlockList } from '../../components/ListActions/UnlockList'
import { useSubmitting } from '@island.is/react-spa/shared'
import {
  PaginatedEndorsementResponse,
  EndorsementList,
} from '@island.is/api/schema'

const PetitionList = () => {
  const { listId, petition, endorsements } = useLoaderData() as any
  const { formatMessage } = useLocale()
  const navigation = useNavigation()
  const navigate = useNavigate()
  const revalidator = useRevalidator()

  const [title, setTitle] = useState(petition?.title)
  const [description, setDescription] = useState(petition?.description)
  const [closedDate, setClosedDate] = useState(
    petition?.closedDate ? new Date(petition?.closedDate) : new Date(),
  )
  const [openedDate, setOpenedDate] = useState(
    petition?.openedDate ? new Date(petition?.openedDate) : new Date(),
  )

  const { isLoading, isSubmitting } = useSubmitting()

  const actionData = useActionData() as UpdateListMutation

  const [isLockListModalVisible, setIsLockListModalVisible] = useState(false)
  const [isUnlockListModalVisible, setIsUnlockListModalVisible] =
    useState(false)

  useEffect(() => {
    if (actionData) {
      actionData?.endorsementSystemUpdateEndorsementList
        ? toast.success(formatMessage(m.toastUpdateSuccess))
        : toast.error(formatMessage(m.toastUpdateError))
    }
  }, [actionData])

  return (
    <>
      <Box marginBottom={6}>
        <Button
          variant="text"
          preTextIcon="arrowBack"
          size="small"
          onClick={() => {
            navigate(-1)
          }}
        >
          {formatMessage(m.goBack)}
        </Button>
      </Box>
      {navigation.state !== 'loading' &&
      revalidator.state !== 'loading' &&
      petition ? (
        <>
          <Form method="post">
            {petition.adminLock && (
              <Box marginY={5}>
                <AlertMessage
                  type="error"
                  title={formatMessage(m.listIsLocked)}
                  message={formatMessage(m.listIsLockedMessage)}
                />
              </Box>
            )}
            <Stack space={3}>
              <Input
                name="title"
                value={title ?? ''}
                onChange={(e) => {
                  setTitle(e.target.value)
                }}
                label={formatMessage(m.listName)}
              />
              <Input
                name="description"
                value={description ?? ''}
                onChange={(e) => {
                  setDescription(e.target.value)
                }}
                label={formatMessage(m.listDescription)}
                textarea
                rows={12}
              />
              {closedDate && openedDate && (
                <Box display={['block', 'flex']} justifyContent="spaceBetween">
                  <Box width="half" marginRight={[0, 2]}>
                    <DatePicker
                      name="openedDate"
                      selected={new Date(openedDate)}
                      handleChange={(date) => setOpenedDate(date)}
                      label={formatMessage(m.listOpenFrom)}
                      locale="is"
                      placeholderText={formatMessage(m.selectDate)}
                    />
                  </Box>
                  <Box width="half" marginLeft={[0, 2]} marginTop={[2, 0]}>
                    <DatePicker
                      name="closedDate"
                      selected={new Date(closedDate)}
                      handleChange={(date) => setClosedDate(date)}
                      label={formatMessage(m.listOpenTil)}
                      locale="is"
                      placeholderText={formatMessage(m.selectDate)}
                    />
                  </Box>
                </Box>
              )}

              <Input
                backgroundColor="blue"
                disabled
                name={petition?.ownerName ?? ''}
                value={petition?.ownerName ?? ''}
                label={formatMessage(m.listOwner)}
              />

              <Box display="flex" justifyContent="spaceBetween" marginTop={2}>
                {!petition.adminLock ? (
                  <>
                    <Button
                      icon="lockClosed"
                      iconType="outline"
                      colorScheme="destructive"
                      onClick={() => setIsLockListModalVisible(true)}
                    >
                      {formatMessage(m.lockList)}
                    </Button>
                    <LockList
                      isVisible={isLockListModalVisible}
                      onClose={() => setIsLockListModalVisible(false)}
                    />
                  </>
                ) : (
                  <>
                    <Button
                      icon="lockOpened"
                      iconType="outline"
                      onClick={() => setIsUnlockListModalVisible(true)}
                    >
                      {formatMessage(m.unlockList)}
                    </Button>
                    <UnlockList
                      isVisible={isUnlockListModalVisible}
                      onClose={() => setIsUnlockListModalVisible(false)}
                    />
                  </>
                )}
                <Button
                  loading={isSubmitting || isLoading}
                  type="submit"
                  icon="reload"
                  variant="ghost"
                >
                  {formatMessage(m.updateList)}
                </Button>
              </Box>
            </Stack>
          </Form>
          <ListSignersTable
            petitionSigners={endorsements as PaginatedEndorsementResponse}
            petition={petition as EndorsementList}
            listId={listId}
          />
        </>
      ) : (
        <Skeleton />
      )}
    </>
  )
}

export default PetitionList
