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
import { m } from '../../lib/messages'
import { useNavigate } from 'react-router-dom'
import { SignatureCollectionList } from '@island.is/api/schema'
import { useSignatureCollectionAdminRemoveListMutation } from './removeList.generated'

const RemoveList = ({ list }: { list: SignatureCollectionList }) => {
  const { formatMessage } = useLocale()
  const navigate = useNavigate()

  const [modalRemoveListIsOpen, setModalRemoveListIsOpen] = useState(false)

  const [removeList, { loading }] =
    useSignatureCollectionAdminRemoveListMutation({
      variables: {
        input: {
          listId: list.id,
          collectionType: list.collectionType,
        },
      },
      onCompleted: (response) => {
        if (response.signatureCollectionAdminRemoveList?.success) {
          setModalRemoveListIsOpen(false)
          toast.success(formatMessage(m.cancelCollectionModalToastSuccess))
          navigate(-1)
        } else {
          const message =
            response.signatureCollectionAdminRemoveList?.reasons?.[0] ??
            formatMessage(m.cancelCollectionModalToastError)
          toast.error(message)
        }
      },
      onError: () => {
        toast.error(formatMessage(m.cancelCollectionModalToastError))
      },
    })

  return (
    <Box>
      <GridRow>
        <GridColumn span={['12/12', '12/12', '12/12', '10/12']}>
          <Box display="flex">
            <Tag variant="red">
              <Box display="flex" justifyContent="center">
                <Icon icon="trash" type="outline" color="red600" />
              </Box>
            </Tag>
            <Box marginLeft={5}>
              <Text variant="h4">
                {formatMessage(m.cancelCollectionButton)}
              </Text>
              <Text marginBottom={2}>
                {formatMessage(m.cancelCollectionDescription)}
              </Text>
              <Button
                variant="text"
                size="small"
                colorScheme="destructive"
                onClick={() => setModalRemoveListIsOpen(true)}
              >
                {formatMessage(m.cancelCollectionButton)}
              </Button>
            </Box>
          </Box>
        </GridColumn>
      </GridRow>
      <Modal
        id="toggleLockList"
        isVisible={modalRemoveListIsOpen}
        title={formatMessage(m.cancelCollectionButton)}
        onClose={() => setModalRemoveListIsOpen(false)}
        label={''}
        closeButtonLabel={''}
      >
        <Box>
          <Text>{formatMessage(m.cancelCollectionModalMessage)}</Text>
          <Box display="flex" justifyContent="flexEnd" marginTop={5}>
            <Button
              iconType="outline"
              variant="ghost"
              onClick={() => removeList()}
              icon="trash"
              colorScheme="destructive"
              loading={loading}
            >
              {formatMessage(m.cancelCollectionModalConfirmButton)}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  )
}

export default RemoveList
