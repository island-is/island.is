import { useState } from 'react'
import { Box, Stack, Button, Text, Input } from '@island.is/island-ui/core'
import { Modal } from '@island.is/service-portal/core'
import { useLocale } from '@island.is/localization'

const AddManager = ({ collectionId }: { collectionId: string }) => {
  const { formatMessage } = useLocale()

  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [nationalIdInput, setNationalIdInput] = useState('')
  const [nationalIdNotFound, setNationalIdNotFound] = useState(false)
  const [name, setName] = useState('')

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="flexEnd"
        alignItems="flexEnd"
        style={{ minWidth: '150px' }}
      >
        <Button
          variant="utility"
          icon="add"
          iconType="outline"
          onClick={() => {
            setModalIsOpen(true)
          }}
        >
          Bæta við
        </Button>
      </Box>
      <Modal
        id="createCollection"
        isVisible={modalIsOpen}
        label={''}
        onCloseModal={() => setModalIsOpen(false)}
      >
        <Text marginBottom={5} variant="h2">
          {formatMessage('Bæta við ábyrgðaraðila')}
        </Text>
        <Stack space={3}>
          <Input
            label={formatMessage('Kennitala')}
            backgroundColor={'blue'}
            name="nationalId"
            value={nationalIdInput}
            onChange={(e) => {
              setNationalIdInput(e.target.value)
            }}
          />
          <Input
            label={formatMessage('Nafn')}
            backgroundColor={'white'}
            readOnly
            name="name"
            value={name}
          />
        </Stack>
        <Box display="flex" justifyContent="center" marginY={5}>
          <Button
            onClick={() => {
              console.log('todo')
            }}
          >
            {formatMessage('Bæta við')}
          </Button>
        </Box>
      </Modal>
    </Box>
  )
}

export default AddManager
