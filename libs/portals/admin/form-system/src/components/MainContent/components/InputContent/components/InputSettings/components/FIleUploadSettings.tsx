import {
  GridRow as Row,
  GridColumn as Column,
  Checkbox,
  Stack,
  Box,
  Select,
  Text,
  Option,
} from '@island.is/island-ui/core'
import { useContext } from 'react'
import { fileTypes } from '../../../../../../../utils/fileTypes'
import { ControlContext } from '../../../../../../../context/ControlContext'
import { FormSystemInput } from '@island.is/api/schema'
import { m } from '../../../../../../../lib/messages'
import { useIntl } from 'react-intl'

const fileSizes = {
  fileSizes: [
    {
      label: '1 mb',
      value: 1048576,
    },
    {
      label: '2 mb',
      value: 2097152,
    },
    {
      label: '3 mb',
      value: 3145728,
    },
    {
      label: '4 mb',
      value: 4194304,
    },
    {
      label: '5 mb',
      value: 5242880,
    },
    {
      label: '6 mb',
      value: 6291456,
    },
    {
      label: '7 mb',
      value: 7340032,
    },
    {
      label: '8 mb',
      value: 8388608,
    },
    {
      label: '9 mb',
      value: 9437184,
    },
    {
      label: '10 mb',
      value: 10485760,
    },
  ],
}

export const FileUploadSettings = () => {
  const { control, controlDispatch, updateActiveItem } =
    useContext(ControlContext)
  const { activeItem } = control
  const currentItem = activeItem.data as FormSystemInput
  const { inputSettings } = currentItem

  const fileSizeOptions = fileSizes.fileSizes.map((size) => ({
    label: size.label,
    value: size.value,
  }))

  const fileAmountOptions: Option<number>[] = Array.from(
    { length: 10 },
    (_, i) => ({
      label: `${i + 1}`,
      value: i + 1,
    }),
  )
  const { formatMessage } = useIntl()
  return (
    <Stack space={2}>
      <Row>
        <Column>
          <Checkbox
            name="multi"
            label={formatMessage(m.allowMultiple)}
            checked={inputSettings?.isMulti ?? false}
            onChange={(e) =>
              controlDispatch({
                type: 'SET_FILE_UPLOAD_SETTINGS',
                payload: {
                  property: 'isMulti',
                  checked: e.target.checked,
                  update: updateActiveItem,
                },
              })
            }
          />
        </Column>
      </Row>
      <Row>
        <Column span="5/10">
          <Select
            label={formatMessage(m.maxFileSize)}
            name="maxFileSize"
            placeholder={formatMessage(m.selectMaxFileSize)}
            backgroundColor="blue"
            value={fileSizeOptions.find(
              (f) => f.value === inputSettings?.maxSize,
            )}
            options={fileSizeOptions}
            onChange={(e) =>
              controlDispatch({
                type: 'SET_FILE_UPLOAD_SETTINGS',
                payload: {
                  property: 'maxSize',
                  value: e?.value,
                  update: updateActiveItem,
                },
              })
            }
          />
        </Column>
        {inputSettings?.isMulti && (
          <Column span="5/10">
            <Select
              label={formatMessage(m.maxFileAmount)}
              name="maxAmount"
              placeholder={formatMessage(m.selectMaxFileAmount)}
              backgroundColor="blue"
              value={fileAmountOptions.find(
                (f) => f.value === inputSettings.amount,
              )}
              options={fileAmountOptions}
              onChange={(e) =>
                controlDispatch({
                  type: 'SET_FILE_UPLOAD_SETTINGS',
                  payload: {
                    property: 'amount',
                    value: e?.value,
                    update: updateActiveItem,
                  },
                })
              }
            />
          </Column>
        )}
      </Row>
      <Row>
        <Column>
          <Text variant="h5">{formatMessage(m.allowFileTypes)}</Text>
        </Column>
      </Row>
      <Row>
        {Object.entries(fileTypes).map(([key, value], i) => (
          <Box padding={2} key={i} style={{ width: '15%' }}>
            {key !== 'default' && (
              <Checkbox
                label={key}
                value={value as string}
                checked={inputSettings?.types?.includes(key)}
                onChange={(e) =>
                  controlDispatch({
                    type: 'SET_FILE_UPLOAD_SETTINGS',
                    payload: {
                      property: 'types',
                      checked: e.target.checked,
                      value: key,
                      update: updateActiveItem,
                    },
                  })
                }
              />
            )}
          </Box>
        ))}
      </Row>
    </Stack>
  )
}
