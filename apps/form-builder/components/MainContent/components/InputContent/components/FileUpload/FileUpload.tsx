import {
  GridRow as Row,
  GridColumn as Column,
  Checkbox,
  Stack,
  Box,
  Select,
  Text,
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

  const fileAmountOptions = () => {
    const arr = []
    for (let i = 1; i < 11; i++) {
      arr.push({ label: i, value: i })
    }
    return arr
  }

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
                  value: e.target.checked,
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
            onChange={(e: { label; value }) => {
              listsDispatch({
                type: 'setFileUploadSettings',
                payload: {
                  property: 'hamarksstaerd',
                  value: e.value,
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
              value={fileAmountOptions().find(
                (f) => f.value === inputSettings.fjoldi,
              )}
              options={fileAmountOptions()}
              onChange={(e: { label; value }) => {
                listsDispatch({
                  type: 'setFileUploadSettings',
                  payload: {
                    property: 'fjoldi',
                    value: e.value,
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
                checked={inputSettings.tegundir.includes(key)}
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
