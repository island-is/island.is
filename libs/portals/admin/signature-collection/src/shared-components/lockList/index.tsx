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
  listId,
  collectionType,
}: {
  listId: string
  collectionType: SignatureCollectionCollectionType
}) => {
  const { formatMessage } = useLocale()
  const { revalidate } = useRevalidator()

  const [modalLockListIsOpen, setModalLockListIsOpen] = useState(false)

  const [lockList, { loading: loadingLockList }] =
    useSignatureCollectionLockListMutation({
      variables: {
        input: {
          listId,
          collectionType,
        },
      },
      onCompleted: (response) => {
        if (response.signatureCollectionLockList.success) {
          setModalLockListIsOpen(false)
          revalidate()
          toast.success(formatMessage(m.lockListSuccess))
        } else {
          const message =
            response.signatureCollectionLockList?.reasons?.[0] ??
            formatMessage(m.lockListError)
          toast.error(message)
        }
      },
      onError: () => {
        toast.error(formatMessage(m.lockListError))
      },
    })

  return (
    <Box>
      <GridRow>
        <GridColumn span={['12/12', '12/12', '12/12', '10/12']}>
          <Box display="flex">
            <Tag>
              <Box display="flex" justifyContent="center">
                <Icon icon="lockClosed" type="outline" color="blue600" />
              </Box>
            </Tag>
            <Box marginLeft={5}>
              <Text variant="h4">{formatMessage(m.lockList)}</Text>
              <Text marginBottom={2}>
                {formatMessage(m.lockListDescription)}
              </Text>
              <Button
                variant="text"
                size="small"
                onClick={() => setModalLockListIsOpen(true)}
              >
                {formatMessage(m.lockList)}
              </Button>
            </Box>
          </Box>
        </GridColumn>
      </GridRow>
      <Modal
        id="toggleLockList"
        isVisible={modalLockListIsOpen}
        title={formatMessage(m.lockList)}
        onClose={() => setModalLockListIsOpen(false)}
        label={''}
        closeButtonLabel={''}
      >
        <Box marginTop={5}>
          <Text>{formatMessage(m.lockListDescription)}</Text>
          <Box display="flex" justifyContent="flexEnd" marginTop={5}>
            <Button
              iconType="outline"
              variant="ghost"
              onClick={() => lockList()}
              loading={loadingLockList}
              icon="lockClosed"
              colorScheme="destructive"
            >
              {formatMessage(m.lockList)}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  )
}

export default ActionLockList
