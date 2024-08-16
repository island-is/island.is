import { useState } from 'react'
import { Box, Stack, Button, Input, Checkbox } from '@island.is/island-ui/core'
import { Modal } from '@island.is/service-portal/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../../../../lib/messages'
import { constituencies } from 'libs/service-portal/signature-collection/src/lib/constants'

const EditPerson = () => {
  const { formatMessage } = useLocale()
  const [modalIsOpen, setModalIsOpen] = useState(false)

  return (
    <Box>
      <Button
        variant="text"
        icon="pencil"
        iconType="outline"
        size="small"
        onClick={() => {
          setModalIsOpen(true)
        }}
      />
      <Modal
        id="editSupervisor"
        isVisible={modalIsOpen}
        label={''}
        initialVisibility={false}
        onCloseModal={() => setModalIsOpen(false)}
      >
        <Stack space={3}>
          <Input
            label={formatMessage(m.personNationalId)}
            backgroundColor="white"
            name="nationalId"
            value={'010130-3019'}
            readOnly
          />
          <Input
            label={formatMessage(m.personName)}
            backgroundColor="white"
            name="name"
            value={'Nafni Nafnason'}
            readOnly
          />
          {constituencies.map((constituency) => (
            <Checkbox
              key={constituency}
              label={constituency}
              name={constituency}
              value={constituency}
            />
          ))}
        </Stack>
        <Box display="flex" justifyContent="center" marginY={5}>
          <Button>{formatMessage(m.save)}</Button>
        </Box>
      </Modal>
    </Box>
  )
}

export default EditPerson
