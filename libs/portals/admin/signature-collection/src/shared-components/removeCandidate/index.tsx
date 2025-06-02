import { useLocale } from '@island.is/localization'
import {
  Box,
  Button,
  GridColumn,
  GridRow,
  Icon,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import { useState } from 'react'
import { Modal } from '@island.is/react/components'
import { m } from '../../lib/messages'

const RemoveCandidate = () => {
  const { formatMessage } = useLocale()

  const [modalRemoveCandidateIsOpen, setModalRemoveCandidateIsOpen] =
    useState(false)
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
                Texti sem útskýrir þessa aðgerð betur kemur hér.
              </Text>
              <Button
                variant="text"
                size="small"
                colorScheme="destructive"
                onClick={() => setModalRemoveCandidateIsOpen(true)}
              >
                {formatMessage(m.cancelCollectionButton)}
              </Button>
            </Box>
          </Box>
        </GridColumn>
      </GridRow>
      <Modal
        id="toggleLockList"
        isVisible={modalRemoveCandidateIsOpen}
        title={formatMessage(m.lockList)}
        onClose={() => setModalRemoveCandidateIsOpen(false)}
        label={''}
        closeButtonLabel={''}
      >
        <Box marginTop={5}>
          <Text>{formatMessage(m.lockListDescription)}</Text>
          <Box display="flex" justifyContent="flexEnd" marginTop={5}>
            <Button
              iconType="outline"
              variant="ghost"
              onClick={() => console.log('Todo: add remove action')}
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

export default RemoveCandidate
