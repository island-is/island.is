import { useEffect, useState } from 'react'
import {
  ChartDataSourceConfiguration,
  ChartDataSourceExternalJsonProvider,
  ChartDataSourceType,
} from 'api-cms-domain'
import { FieldExtensionSDK } from '@contentful/app-sdk'
import {
  Box,
  Flex,
  FormControl,
  Select,
  TextInput,
} from '@contentful/f36-components'
import { JsonEditor } from '@contentful/field-editor-json'
import { useSDK } from '@contentful/react-apps-toolkit'

type FieldValue = ChartDataSourceConfiguration

const dataSourceTypeOptions = Object.values(ChartDataSourceType).map(
  (option) => ({
    label: option.replace(/([A-Z])/g, ' $1').trim(),
    value: option,
  }),
)
const externalJsonProviderOptions = Object.values(
  ChartDataSourceExternalJsonProvider,
).map((option) => ({
  label: option.replace(/([A-Z])/g, ' $1').trim(),
  value: option,
}))

const ChartDataSourceConfigurationField = () => {
  const sdk = useSDK<FieldExtensionSDK>()

  useEffect(() => {
    sdk.window.startAutoResizer()
  }, [sdk.window])

  const [fieldValue, setFieldValue] = useState<FieldValue>(
    sdk.field.getValue() ||
      ({
        dataSourceType: ChartDataSourceType.InternalJson,
        externalCsvProviderUrl: '',
        externalJsonProvider:
          ChartDataSourceExternalJsonProvider.UltravioletRadiationLatest,
        internalJson: { statistics: [] },
      } as FieldValue),
  )

  const updateFieldValue = <T extends keyof FieldValue>(
    key: T,
    value: FieldValue[T],
  ) => {
    setFieldValue((previousFieldValue) => {
      const updatedFieldValue: FieldValue = {
        ...previousFieldValue,
        [key]: value,
      }
      sdk.field.setValue(updatedFieldValue)
      return updatedFieldValue
    })
  }

  return (
    <Flex flexDirection="column" gap="32px" paddingBottom="spacing2Xl">
      <Box>
        <FormControl.Label>Data source type</FormControl.Label>
        <Select
          onChange={(event) => {
            updateFieldValue(
              'dataSourceType',
              event.target.value as FieldValue['dataSourceType'],
            )
          }}
          value={fieldValue.dataSourceType}
        >
          {dataSourceTypeOptions.map((option) => (
            <Select.Option key={option.value} value={option.value}>
              {option.label}
            </Select.Option>
          ))}
        </Select>
      </Box>
      {fieldValue.dataSourceType === ChartDataSourceType.ExternalCsv && (
        <Box>
          <FormControl.Label>CSV url</FormControl.Label>
          <TextInput />
          <FormControl.HelpText>
            For example:
            https://docs.google.com/spreadsheets/.../export?format=csv
          </FormControl.HelpText>
        </Box>
      )}
      {fieldValue.dataSourceType === ChartDataSourceType.ExternalJson && (
        <Box>
          <FormControl.Label>
            Choose which API provides the data
          </FormControl.Label>
          <Select
            onChange={(event) => {
              updateFieldValue(
                'externalJsonProvider',
                event.target.value as FieldValue['externalJsonProvider'],
              )
            }}
            value={fieldValue.externalJsonProvider}
          >
            {externalJsonProviderOptions.map((option) => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        </Box>
      )}
      {fieldValue.dataSourceType === ChartDataSourceType.InternalJson && (
        <Box>
          <JsonEditor
            field={{
              getIsDisabled() {
                return false
              },
              getSchemaErrors() {
                return []
              },
              getValue() {
                return {}
              },
              id: 'json',
              locale: sdk.field.locale,
              onIsDisabledChanged(callback) {
                return () => {}
              },
              onSchemaErrorsChanged(callback) {
                return () => {}
              },
              onValueChanged(callback) {
                return () => {}
              },
              async removeValue() {},
              required: false,
              async setInvalid(value) {},
              async setValue(value) {
                return '{}'
              },
              type: sdk.field.type,
              validations: [],
              items: { type: sdk.field.type },
            }}
            isInitiallyDisabled={false}
          />
        </Box>
      )}
    </Flex>
  )
}

export default ChartDataSourceConfigurationField
