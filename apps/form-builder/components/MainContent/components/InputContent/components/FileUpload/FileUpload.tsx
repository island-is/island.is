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
import FormBuilderContext from '../../../../../../context/FormBuilderContext'
import { IInput } from '../../../../../../types/interfaces'
import fileSizes from './fileSizes.json'
import * as fileTypes from '../../../../../../lib/fileTypes.json'

export default function FileUpload() {
  const { lists, listsDispatch } = useContext(FormBuilderContext)
  const { activeItem } = lists
  const currentItem = activeItem.data as IInput
  const { inputSettings } = currentItem

  const fileSizeOptions = fileSizes.fileSizes.map((size) => ({
    label: size.label,
    value: size.value,
  }))

  const fileAmountOptions: Option<number>[] = [
    { label: '1', value: 1 },
    { label: '2', value: 2 },
    { label: '3', value: 3 },
    { label: '4', value: 4 },
    { label: '5', value: 5 },
    { label: '6', value: 6 },
    { label: '7', value: 7 },
    { label: '8', value: 8 },
    { label: '9', value: 9 },
    { label: '10', value: 10 },
  ]

  return (
    <Stack space={2}>
      <Row>
        <Column>
          <Checkbox
            name="multi"
            label="Er fjölval"
            checked={inputSettings.erFjolval}
            onChange={(e) =>
              listsDispatch({
                type: 'setFileUploadSettings',
                payload: {
                  property: 'erFjolval',
                  checked: e.target.checked,
                },
              })
            }
          />
        </Column>
      </Row>
      <Row>
        <Column span="5/10">
          <Select
            label="Hámarksstærð skráa"
            name="maxFileSize"
            placeholder="Veldu hámarksstærð"
            backgroundColor="blue"
            value={fileSizeOptions.find(
              (f) => f.value === inputSettings.hamarksstaerd,
            )}
            options={fileSizeOptions}
            onChange={(e) => {
              listsDispatch({
                type: 'setFileUploadSettings',
                payload: {
                  property: 'hamarksstaerd',
                  value: e?.value ?? undefined,
                },
              })
            }}
          />
        </Column>
        {inputSettings.erFjolval && (
          <Column span="5/10">
            <Select
              label="Hámarksfjoldi skráa"
              name="maxAmount"
              placeholder="Veldu hámarksfjolda"
              backgroundColor="blue"
              value={fileAmountOptions.find(
                (f) => f.value === inputSettings.fjoldi,
              )}
              options={fileAmountOptions}
              onChange={(e) => {
                listsDispatch({
                  type: 'setFileUploadSettings',
                  payload: {
                    property: 'fjoldi',
                    value: e?.value ?? undefined,
                  },
                })
              }}
            />
          </Column>
        )}
      </Row>
      <Row>
        <Column>
          <Text variant="h5">Leyfa eftirfarandi skjalatýpur</Text>
        </Column>
      </Row>
      <Row>
        {Object.entries(fileTypes).map(([key, value], i) => (
          <Box padding={2} key={i} style={{ width: '15%' }}>
            {key !== 'default' && (
              <Checkbox
                label={key}
                value={value}
                checked={inputSettings.tegundir?.includes(key)}
                onChange={(e) =>
                  listsDispatch({
                    type: 'setFileUploadSettings',
                    payload: {
                      property: 'tegundir',
                      checked: e.target.checked,
                      value: key,
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
