import { useEffect, useState } from 'react'
import NumberFormat from 'react-number-format'
import { useDebounce } from 'react-use'
import { FieldExtensionSDK } from '@contentful/app-sdk'
import {
  Box,
  Button,
  Datepicker,
  Radio,
  Stack,
  TextInput,
} from '@contentful/f36-components'
import { DeleteIcon, PlusIcon } from '@contentful/f36-icons'
import { Table } from '@contentful/f36-table'
import { useSDK } from '@contentful/react-apps-toolkit'

const DEBOUNCE_TIME = 150

enum SourceDataKeyValues {
  Manual = 'manual',
  ExternalSourceKey = 'externalSourceKey',
}

enum ManualDataKeyValues {
  Date = 'date',
  Category = 'category',
}

const generateId = (items: ManualData, dataKeyValue: ManualDataKeyValues) => {
  let highestId = 0

  const manualDataItems =
    dataKeyValue === ManualDataKeyValues.Date
      ? items?.dateItems ?? []
      : items?.categoryItems ?? []
  for (const item of manualDataItems) {
    if (item.id > highestId) {
      highestId = item.id
    }
  }

  return highestId + 1
}

const sortByDateOfChange = (a: ManualDataDateItem, b: ManualDataDateItem) => {
  if (a.dateOfChange > b.dateOfChange) {
    return -1
  } else if (a.dateOfChange < b.dateOfChange) {
    return 1
  }
  return 0
}

interface ManualData {
  typeOfSource: SourceDataKeyValues
  typeOfManualDataKey: ManualDataKeyValues
  externalSourceDataKey?: string
  dateItems: {
    id: number
    key: string
    dateOfChange: string
    value: number
  }[]
  categoryItems: {
    id: number
    key: string
    category: string
    value: number
  }[]
}

type ManualDataDateItem = ManualData['dateItems'][number]

const ChartComponentSourceDataKeyField = () => {
  const sdk = useSDK<FieldExtensionSDK>()

  const [manualData, setManualData] = useState<ManualData>(
    sdk.entry.fields.values.getValue() || {
      typeOfSource: SourceDataKeyValues.ExternalSourceKey,
      typeOfManualDataKey: ManualDataKeyValues.Date,
      dateItems: [],
      categoryItems: [],
    },
  )
  const typeOfSource = manualData ? manualData['typeOfSource'] : null
  const externalSourceDataKey = manualData
    ? manualData['externalSourceDataKey']
    : ''
  const [sourceDataKeyValue, setSourceDataKeyValue] = useState(
    typeOfSource ?? SourceDataKeyValues.ExternalSourceKey,
  )

  const [textInput, setTextInput] = useState(externalSourceDataKey)

  const [manualDataKeyValue, setManualDataKeyValue] = useState(
    ManualDataKeyValues.Date,
  )

  const componentKeyValue = sdk.ids.entry

  useEffect(() => {
    sdk.window.startAutoResizer()
  }, [sdk.window])

  useDebounce(
    () => {
      sdk.entry.fields.values.setValue(manualData)
    },
    DEBOUNCE_TIME,
    [manualData],
  )

  useEffect(() => {
    setManualData((prevManualData) => ({
      ...prevManualData,
      typeOfSource: sourceDataKeyValue,
      externalSourceDataKey: textInput,
      ...(sourceDataKeyValue === SourceDataKeyValues.Manual && {
        typeOfManualDataKey: manualDataKeyValue,
      }),
    }))
  }, [sourceDataKeyValue, manualDataKeyValue, textInput])

  useEffect(() => {
    if (sourceDataKeyValue === SourceDataKeyValues.Manual) {
      sdk.entry.fields.sourceDataKey.setValue(componentKeyValue)
    } else {
      sdk.entry.fields.sourceDataKey.setValue(textInput)
    }
  }, [
    componentKeyValue,
    sdk.entry.fields.sourceDataKey,
    sourceDataKeyValue,
    textInput,
  ])

  const updateManualDataDateItem = (
    id: number,
    key: keyof ManualData['dateItems'][number],
    value: number | string,
  ) => {
    setManualData((prevManualData) => ({
      ...prevManualData,
      dateItems: prevManualData?.dateItems?.map((item) => {
        if (item.id !== id) return item
        return {
          ...item,
          [key]: value,
        }
      }),
    }))
  }
  const updateManualDataCategoryItem = (
    id: number,
    key: keyof ManualData['categoryItems'][number],
    value: number | string,
  ) => {
    setManualData((prevManualData) => ({
      ...prevManualData,
      categoryItems: prevManualData?.categoryItems?.map((item) => {
        if (item.id !== id) return item
        return {
          ...item,
          [key]: value,
        }
      }),
    }))
  }

  const disableMoreThanOneItemOnPieChart =
    sdk.entry.fields.type.getValue() === 'pie-cell' &&
    (manualData?.categoryItems?.length > 0 || manualData?.dateItems?.length > 0)

  return (
    <>
      <Stack flexDirection="row" marginBottom={'spacingM'}>
        <Radio
          id={SourceDataKeyValues.Manual}
          name="manual"
          value={SourceDataKeyValues.Manual}
          isChecked={sourceDataKeyValue === 'manual'}
          onChange={() => setSourceDataKeyValue(SourceDataKeyValues.Manual)}
        >
          Manual
        </Radio>
        <Radio
          id={SourceDataKeyValues.ExternalSourceKey}
          name="externalSourceKey"
          value={SourceDataKeyValues.ExternalSourceKey}
          isChecked={sourceDataKeyValue === 'externalSourceKey'}
          onChange={() =>
            setSourceDataKeyValue(SourceDataKeyValues.ExternalSourceKey)
          }
        >
          External source key
        </Radio>
      </Stack>
      <Stack flexDirection="column">
        {sourceDataKeyValue === SourceDataKeyValues.Manual && (
          <>
            <Stack flexDirection="row">
              <Radio
                id={ManualDataKeyValues.Date}
                name="date"
                value={ManualDataKeyValues.Date}
                isChecked={manualDataKeyValue === 'date'}
                onChange={() => setManualDataKeyValue(ManualDataKeyValues.Date)}
              >
                Date
              </Radio>
              <Radio
                id={ManualDataKeyValues.Category}
                name="category"
                value={ManualDataKeyValues.Category}
                isChecked={manualDataKeyValue === 'category'}
                onChange={() =>
                  setManualDataKeyValue(ManualDataKeyValues.Category)
                }
              >
                Category
              </Radio>
            </Stack>
            <Box
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              {manualDataKeyValue === ManualDataKeyValues.Date && (
                <Button
                  onClick={() => {
                    setManualData((prevManualData) => ({
                      ...prevManualData,
                      dateItems: (prevManualData?.dateItems ?? []).concat({
                        id: generateId(prevManualData, manualDataKeyValue),
                        key: componentKeyValue,
                        dateOfChange: new Date().toISOString(),
                        value: 0,
                      }),
                    }))
                  }}
                  startIcon={<PlusIcon />}
                  isDisabled={disableMoreThanOneItemOnPieChart}
                >
                  Add item
                </Button>
              )}
              {manualDataKeyValue === ManualDataKeyValues.Category && (
                <Button
                  onClick={() => {
                    setManualData((prevManualData) => ({
                      ...prevManualData,
                      categoryItems: (
                        prevManualData?.categoryItems ?? []
                      ).concat({
                        id: generateId(prevManualData, manualDataKeyValue),
                        key: componentKeyValue,
                        category: '',
                        value: 0,
                      }),
                    }))
                  }}
                  isDisabled={disableMoreThanOneItemOnPieChart}
                  startIcon={<PlusIcon />}
                >
                  Add item
                </Button>
              )}
            </Box>
            {manualDataKeyValue === ManualDataKeyValues.Date &&
              manualData?.dateItems?.length > 0 && (
                <Table>
                  <Table.Head>
                    <Table.Row>
                      <Table.Cell>Date</Table.Cell>
                      <Table.Cell>Value</Table.Cell>
                      <Table.Cell />
                    </Table.Row>
                  </Table.Head>
                  <Table.Body>
                    {manualData.dateItems
                      .sort(sortByDateOfChange)
                      .map((change) => (
                        <Table.Row key={change.id}>
                          <Table.Cell>
                            <Datepicker
                              onSelect={(day) => {
                                updateManualDataDateItem(
                                  change.id,
                                  'dateOfChange',
                                  day.toISOString(),
                                )
                              }}
                              selected={
                                change.dateOfChange
                                  ? new Date(change.dateOfChange)
                                  : null
                              }
                            />
                          </Table.Cell>
                          <Table.Cell>
                            <NumberFormat
                              customInput={TextInput}
                              value={String(change.value || '')}
                              onValueChange={(ev) => {
                                updateManualDataDateItem(
                                  change.id,
                                  'value',
                                  Number(ev.value),
                                )
                              }}
                              isNumericString={true}
                              inputMode="decimal"
                              thousandSeparator="."
                              decimalSeparator=","
                            />
                          </Table.Cell>
                          <Table.Cell>
                            <Button
                              onClick={() => {
                                sdk.dialogs
                                  .openConfirm({
                                    title: 'Confirm deletion',
                                    message:
                                      'Are you sure you want to delete this item?',
                                    intent: 'negative',
                                  })
                                  .then((value) => {
                                    if (!value) return
                                    setManualData((prevManualData) => ({
                                      ...prevManualData,
                                      dateItems:
                                        prevManualData?.dateItems?.filter(
                                          (item) => item.id !== change.id,
                                        ),
                                    }))
                                  })
                              }}
                              startIcon={<DeleteIcon />}
                            />
                          </Table.Cell>
                        </Table.Row>
                      ))}
                  </Table.Body>
                </Table>
              )}
            {manualDataKeyValue === ManualDataKeyValues.Category &&
              manualData?.categoryItems?.length > 0 && (
                <Table>
                  <Table.Head>
                    <Table.Row>
                      <Table.Cell>Category</Table.Cell>
                      <Table.Cell>Value</Table.Cell>
                      <Table.Cell />
                    </Table.Row>
                  </Table.Head>
                  <Table.Body>
                    {manualData.categoryItems.map((change) => (
                      <Table.Row key={change.id}>
                        <Table.Cell>
                          <TextInput
                            value={change.category}
                            onChange={(ev) => {
                              updateManualDataCategoryItem(
                                change.id,
                                'category',
                                ev.target.value,
                              )
                            }}
                          />
                        </Table.Cell>
                        <Table.Cell>
                          <NumberFormat
                            customInput={TextInput}
                            value={String(change.value || '')}
                            onValueChange={(ev) => {
                              updateManualDataCategoryItem(
                                change.id,
                                'value',
                                Number(ev.value),
                              )
                            }}
                            isNumericString={true}
                            inputMode="decimal"
                            thousandSeparator="."
                            decimalSeparator=","
                          />
                        </Table.Cell>
                        <Table.Cell>
                          <Button
                            onClick={() => {
                              sdk.dialogs
                                .openConfirm({
                                  title: 'Confirm deletion',
                                  message:
                                    'Are you sure you want to delete this item?',
                                  intent: 'negative',
                                })
                                .then((value) => {
                                  if (!value) return
                                  setManualData((prevManualData) => ({
                                    ...prevManualData,
                                    categoryItems:
                                      prevManualData?.categoryItems?.filter(
                                        (item) => item.id !== change.id,
                                      ),
                                  }))
                                })
                            }}
                            startIcon={<DeleteIcon />}
                          />
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              )}
          </>
        )}
        {sourceDataKeyValue === SourceDataKeyValues.ExternalSourceKey && (
          <TextInput
            type="text"
            value={textInput}
            onChange={(event) => {
              setTextInput(event.target.value)
            }}
          ></TextInput>
        )}
      </Stack>
    </>
  )
}

export default ChartComponentSourceDataKeyField
