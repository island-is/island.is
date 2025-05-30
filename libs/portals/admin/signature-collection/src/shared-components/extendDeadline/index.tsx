import { useLocale } from '@island.is/localization'
import {
  Box,
  Button,
  DatePicker,
  Icon,
  Tag,
  toast,
  Text,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'
import { useEffect, useState } from 'react'
import { Modal } from '@island.is/react/components'
import { useExtendDeadlineMutation } from './extendDeadline.generated'
import { useRevalidator } from 'react-router-dom'
import { m } from '../../lib/messages'

const ActionExtendDeadline = ({
  listId,
  endTime,
}: {
  listId: string
  endTime: string
}) => {
  const { formatMessage } = useLocale()
  const [modalChangeDateIsOpen, setModalChangeDateIsOpen] = useState(false)
  const [endDate, setEndDate] = useState(endTime)
  const [extendDeadlineMutation, { loading }] = useExtendDeadlineMutation()
  const { revalidate } = useRevalidator()

  useEffect(() => {
    setEndDate(endDate)
  }, [endDate, endTime])

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
      <GridRow>
        <GridColumn span={['12/12', '12/12', '12/12', '10/12']}>
          <Box display="flex">
            <Tag>
              <Box display="flex" justifyContent="center">
                <Icon icon="calendar" type="outline" color="blue600" />
              </Box>
            </Tag>
            <Box marginLeft={5}>
              <Text variant="h4">{formatMessage(m.updateListEndTime)}</Text>
              <Text color="blue600" variant="eyebrow" marginY={1}>
                25.06.2026 - 12:00
              </Text>
              <Text marginBottom={2}>
                {formatMessage(m.updateListEndTimeDescription)}
              </Text>
              <Button
                variant="text"
                size="small"
                onClick={() => setModalChangeDateIsOpen(true)}
              >
                {formatMessage(m.updateListEndTime)}
              </Button>
            </Box>
          </Box>
        </GridColumn>
      </GridRow>
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
            //selected={new Date(endDate)}
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
