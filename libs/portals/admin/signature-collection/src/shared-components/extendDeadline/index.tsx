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
import format from 'date-fns/format'
import { useEffect, useState } from 'react'
import { Modal } from '@island.is/react/components'
import { useExtendDeadlineMutation } from './extendDeadline.generated'
import { useRevalidator } from 'react-router-dom'
import { m } from '../../lib/messages'
import { SignatureCollectionList } from '@island.is/api/schema'

const ActionExtendDeadline = ({ list }: { list: SignatureCollectionList }) => {
  const { formatMessage } = useLocale()
  const { revalidate } = useRevalidator()

  const [modalChangeDateIsOpen, setModalChangeDateIsOpen] = useState(false)
  const [endDate, setEndDate] = useState(list?.endTime)
  const [extendDeadlineMutation, { loading }] = useExtendDeadlineMutation()

  useEffect(() => {
    setEndDate(endDate)
  }, [endDate, list.endTime])

  const extendDeadline = async (newEndDate: string) => {
    try {
      const { data } = await extendDeadlineMutation({
        variables: {
          input: {
            listId: list.id,
            newEndDate: newEndDate,
            collectionType: list.collectionType,
          },
        },
      })

      const res = data?.signatureCollectionAdminExtendDeadline

      if (res?.success) {
        toast.success(formatMessage(m.updateListEndTimeSuccess))
        revalidate()
      } else {
        toast.error(
          res?.reasons?.[0] ?? formatMessage(m.updateListEndTimeError),
        )
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
                {endDate ? format(new Date(endDate), 'dd.MM.yyyy - HH:mm') : ''}
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
            selected={endDate ? new Date(endDate) : undefined}
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
