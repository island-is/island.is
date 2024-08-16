import { useState } from 'react'
import {
  Box,
  Button,
  Text,
  Checkbox,
  AlertMessage,
} from '@island.is/island-ui/core'
import { Modal } from '@island.is/service-portal/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../../../../lib/messages'
import { constituencies } from 'libs/service-portal/signature-collection/src/lib/constants'

const AddConstituencyModal = () => {
  const { formatMessage } = useLocale()
  const [modalIsOpen, setModalIsOpen] = useState(false)

  return (
    <Box>
      <Button
        variant="utility"
        icon="add"
        onClick={() => {
          setModalIsOpen(true)
        }}
      >
        {formatMessage(m.add)}
      </Button>
      <Modal
        id="addConstituency"
        isVisible={modalIsOpen}
        initialVisibility={false}
        onCloseModal={() => setModalIsOpen(false)}
        label={''}
      >
        <Text marginBottom={2} variant="h2">
          {formatMessage(m.addConstituency)}
        </Text>
        <Text marginBottom={5} variant="default">
          {formatMessage(m.addConstituencyDescription)}
        </Text>
        {constituencies.map((constituency) => (
          <Box key={constituency} marginBottom={3}>
            <Checkbox
              label={constituency}
              value={constituency}
            />
          </Box>
        ))}
        <Box marginTop={5}>
          <AlertMessage
            type="info"
            message={formatMessage(m.addConstituencyAlertInfo)}
          />
        </Box>
        <Box display="flex" justifyContent="center" marginY={5}>
          <Button>{formatMessage(m.add)}</Button>
        </Box>
      </Modal>
    </Box>
  )
}

export default AddConstituencyModal
