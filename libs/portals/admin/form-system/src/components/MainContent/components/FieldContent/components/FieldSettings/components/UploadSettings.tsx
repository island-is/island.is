import { FormSystemField } from '@island.is/api/schema'
import { m } from '@island.is/form-system/ui'
import {
  Box,
  Checkbox,
  GridColumn as Column,
  Option,
  GridRow as Row,
  Select,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useContext } from 'react'
import { useIntl } from 'react-intl'
import { ControlContext } from '../../../../../../../context/ControlContext'
import {
  FILE_TYPE_MAP,
  fileSizes,
} from '../../../../../../../lib/utils/fileTypes'

export const FileUploadSettings = () => {
  const { control, controlDispatch, updateActiveItem } =
    useContext(ControlContext)
  const { activeItem, isReadOnly } = control
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
            isDisabled={isReadOnly}
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
            isDisabled={isReadOnly}
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
        {Object.entries(FILE_TYPE_MAP).map(([key, value], i) => (
          <Box padding={2} key={i} style={{ width: '15%' }}>
            {key !== 'default' && (
              <Checkbox
                label={key}
                value={key}
                checked={types?.includes(key)}
                disabled={isReadOnly}
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
