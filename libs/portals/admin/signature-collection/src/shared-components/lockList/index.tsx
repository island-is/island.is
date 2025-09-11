import { useLocale } from '@island.is/localization'
import {
  Box,
  Button,
  GridColumn,
  GridRow,
  Icon,
  Tag,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { useState } from 'react'
import { Modal } from '@island.is/react/components'
import { useRevalidator } from 'react-router-dom'
import { useSignatureCollectionLockListMutation } from './lockList.generated'
import { m } from '../../lib/messages'
import { SignatureCollectionCollectionType } from '@island.is/api/schema'

const ActionLockList = ({
  isLocked,
  listId,
  collectionType,
}: {
  isLocked: boolean
  listId: string
  collectionType: SignatureCollectionCollectionType
}) => {
  const { formatMessage } = useLocale()
  const { revalidate } = useRevalidator()

  const [modalLockListIsOpen, setModalLockListIsOpen] = useState(false)

  const [lockList, { loading: loadingLockList }] =
    useSignatureCollectionLockListMutation({
      variables: { input: { listId, collectionType, setLocked: !isLocked } },
      onCompleted: (response) => {
        const result = response.signatureCollectionLockList

        if (result?.success) {
          setModalLockListIsOpen(false)
          revalidate()
          toast.success(
            formatMessage(isLocked ? m.unlockListSuccess : m.lockListSuccess),
          )
        } else {
          toast.error(
            result?.reasons?.[0] ??
              formatMessage(isLocked ? m.unlockListError : m.lockListError),
          )
        }
      },
      onError: () => {
        toast.error(
          formatMessage(isLocked ? m.unlockListError : m.lockListError),
        )
      },
    })

  return (
    <Box>
      <GridRow>
        <GridColumn span={['12/12', '12/12', '12/12', '10/12']}>
          <Box display="flex">
            <Tag>
              <Box display="flex" justifyContent="center">
                <Icon
                  icon={isLocked ? 'lockOpened' : 'lockClosed'}
                  type="outline"
                  color="blue600"
                />
              </Box>
            </Tag>
            <Box marginLeft={5}>
              <Text variant="h4">
                {formatMessage(isLocked ? m.unlockList : m.lockList)}
              </Text>
              <Text marginBottom={2}>
                {formatMessage(
                  isLocked ? m.unlockListDescription : m.lockListDescription,
                )}
              </Text>
              <Button
                variant="text"
                size="small"
                onClick={() => setModalLockListIsOpen(true)}
              >
                {formatMessage(isLocked ? m.unlockList : m.lockList)}
              </Button>
            </Box>
          </Box>
        </GridColumn>
      </GridRow>
      <Modal
        id="toggleLockList"
        isVisible={modalLockListIsOpen}
        title={formatMessage(isLocked ? m.unlockList : m.lockList)}
        onClose={() => setModalLockListIsOpen(false)}
        label={''}
        closeButtonLabel={''}
      >
        <Box marginTop={5}>
          <Text>
            {formatMessage(
              isLocked ? m.unlockListDescription : m.lockListDescription,
            )}
          </Text>
          <Box display="flex" justifyContent="flexEnd" marginTop={5}>
            <Button
              iconType="outline"
              variant="ghost"
              onClick={() => lockList()}
              loading={loadingLockList}
              icon={isLocked ? 'lockOpened' : 'lockClosed'}
              colorScheme={isLocked ? 'default' : 'destructive'}
            >
              {formatMessage(isLocked ? m.unlockList : m.lockList)}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  )
}

export default ActionLockList
