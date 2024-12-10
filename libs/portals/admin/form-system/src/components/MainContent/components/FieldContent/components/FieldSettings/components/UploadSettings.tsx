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
import { fileSizes, fileTypes } from '../../../../../../../lib/utils/fileTypes'
import { ControlContext } from '../../../../../../../context/ControlContext'
import { FormSystemField } from '@island.is/api/schema'
import { useIntl } from 'react-intl'
import { m } from '@island.is/form-system/ui'

export const FileUploadSettings = () => {
  const { control, controlDispatch, updateActiveItem } =
    useContext(ControlContext)
  const { activeItem } = control
  const currentItem = activeItem.data as FormSystemField
  const { fieldSettings } = currentItem

  const fileSizeOptions = fileSizes.map((size) => ({
    label: size.label,
    value: size.value,
  }))

  const types = fieldSettings?.fileTypes?.split(',')

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
        <Column span="5/10">
          <Select
            label={formatMessage(m.maxFileSize)}
            name="maxFileSize"
            placeholder={formatMessage(m.selectMaxFileSize)}
            backgroundColor="blue"
            value={fileSizeOptions.find(
              (f) => f.value === fieldSettings?.fileMaxSize,
            )}
            options={fileSizeOptions}
            onChange={(e) =>
              controlDispatch({
                type: 'SET_FILE_UPLOAD_SETTINGS',
                payload: {
                  property: 'fileMaxSize',
                  value: e?.value,
                  update: updateActiveItem,
                },
              })
            }
          />
        </Column>
        <Column span="5/10">
          <Select
            label={formatMessage(m.maxFileAmount)}
            name="maxAmount"
            placeholder={formatMessage(m.selectMaxFileAmount)}
            backgroundColor="blue"
            value={fileAmountOptions.find(
              (f) => f.value === fieldSettings?.maxFiles,
            )}
            options={fileAmountOptions}
            onChange={(e) =>
              controlDispatch({
                type: 'SET_FILE_UPLOAD_SETTINGS',
                payload: {
                  property: 'maxFiles',
                  value: e?.value,
                  update: updateActiveItem,
                },
              })
            }
          />
        </Column>
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
                checked={types?.includes(key)}
                onChange={(e) =>
                  controlDispatch({
                    type: 'SET_FILE_UPLOAD_SETTINGS',
                    payload: {
                      property: 'fileTypes',
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
