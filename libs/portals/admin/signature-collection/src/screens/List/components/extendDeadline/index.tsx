import { useLocale } from '@island.is/localization'
import {
  Box,
  Button,
  DatePicker,
  Input,
  toast,
} from '@island.is/island-ui/core'
import { m } from '../../../../lib/messages'
import { useState } from 'react'
import { Modal } from '@island.is/react/components'
import format from 'date-fns/format'
import { useExtendDeadlineMutation } from './extendDeadline.generated'

const ActionExtendDeadline = ({
  listId,
  endTime,
}: {
  listId: string
  endTime: string
}) => {
  const { formatMessage } = useLocale()
  const [modalChangeDateIsOpen, setModalChangeDateIsOpen] = useState(false)
  const [newEndDate, setNewEndDate] = useState(endTime)
  const [extendDeadlineMutation, { loading }] = useExtendDeadlineMutation()

  const extendDeadline = async (newEndDate: string) => {
    try {
      const res = await extendDeadlineMutation({
        variables: {
          input: {
            id: listId,
            newEndDate: newEndDate,
          },
        },
      })
      if (res.data?.signatureCollectionAdminExtendDeadline.success) {
        toast.success(formatMessage(m.updateListEndTimeSuccess))
      } else {
        toast.error(formatMessage(m.updateListEndTimeError))
      }
    } catch (e) {
      toast.error(e.message)
    }
  }

  return (
    <Box>
      <Box display="flex" alignItems="flexEnd">
        <Input
          name="endTime"
          size="xs"
          label={formatMessage(m.listEndTime)}
          readOnly
          defaultValue={format(new Date(endTime), 'dd.MM.yyyy HH:mm')}
        />
        <Box marginLeft={2}>
          <Button
            icon="calendar"
            iconType="outline"
            size="small"
            variant="utility"
            onClick={() => setModalChangeDateIsOpen(true)}
          ></Button>
        </Box>
      </Box>
      <Modal
        id="extendDeadline"
        isVisible={modalChangeDateIsOpen}
        title={formatMessage(m.updateListEndTime)}
        label={formatMessage(m.updateListEndTime)}
        onClose={() => setModalChangeDateIsOpen(false)}
        closeButtonLabel={''}
      >
        <Box marginTop={5}>
          <DatePicker
            locale="is"
            label={formatMessage(m.listEndTime)}
            selected={new Date(newEndDate)}
            handleChange={(date) => setNewEndDate(new Date(date).toISOString())}
            placeholderText=""
            showTimeInput
          />
          <Box display="flex" justifyContent="flexEnd" marginTop={5}>
            <Button
              onClick={() => {
                extendDeadline(newEndDate)
                setModalChangeDateIsOpen(false)
              }}
            >
              {formatMessage(m.updateListEndTime)}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  )
}

export default ActionExtendDeadline
