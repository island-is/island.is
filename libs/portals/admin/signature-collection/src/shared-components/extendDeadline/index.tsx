import { useLocale } from '@island.is/localization'
import {
  Box,
  Button,
  DatePicker,
  Input,
  toast,
} from '@island.is/island-ui/core'
import { useEffect, useState } from 'react'
import { Modal } from '@island.is/react/components'
import format from 'date-fns/format'
import { useExtendDeadlineMutation } from './extendDeadline.generated'
import { useRevalidator } from 'react-router-dom'
import { m } from '../../lib/messages'

const ActionExtendDeadline = ({
  listId,
  endTime,
  allowedToProcess,
}: {
  listId: string
  endTime: string
  allowedToProcess?: boolean
}) => {
  const { formatMessage } = useLocale()
  const [modalChangeDateIsOpen, setModalChangeDateIsOpen] = useState(false)
  const [endDate, setEndDate] = useState(endTime)
  const [extendDeadlineMutation, { loading }] = useExtendDeadlineMutation()
  const { revalidate } = useRevalidator()

  useEffect(() => {
    setEndDate(endDate)
  }, [endTime])

  const extendDeadline = async (newEndDate: string) => {
    try {
      const res = await extendDeadlineMutation({
        variables: {
          input: {
            listId,
            newEndDate: newEndDate,
          },
        },
      })
      if (res.data?.signatureCollectionAdminExtendDeadline.success) {
        toast.success(formatMessage(m.updateListEndTimeSuccess))
        revalidate()
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
          size="sm"
          label={formatMessage(m.listEndTime)}
          readOnly
          value={format(new Date(endDate), 'dd.MM.yyyy HH:mm')}
        />
        {allowedToProcess && (
          <Box marginLeft={3}>
            <Button
              icon="calendar"
              iconType="outline"
              variant="ghost"
              onClick={() => setModalChangeDateIsOpen(true)}
            ></Button>
          </Box>
        )}
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
            selected={new Date(endDate)}
            handleChange={(date) => setEndDate(new Date(date).toISOString())}
            placeholderText=""
            showTimeInput
          />
          <Box display="flex" justifyContent="flexEnd" marginTop={5}>
            <Button
              loading={loading}
              onClick={() => {
                extendDeadline(endDate)
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
