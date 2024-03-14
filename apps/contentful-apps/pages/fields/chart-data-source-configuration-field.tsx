import { useEffect, useState } from 'react'
import {
  Note,
  Paragraph,
  Flex,
  FormControl,
  Select,
  Box,
  TextInput,
} from '@contentful/f36-components'
import { JsonEditor } from '@contentful/field-editor-json'

import { ChartDataSourceType } from 'api-cms-domain'

import { FieldExtensionSDK } from '@contentful/app-sdk'
import { useCMA, useSDK } from '@contentful/react-apps-toolkit'

const sourceDataTypeOptions = [
  { label: 'CSV', value: 'csv' },
  { label: 'API', value: 'api' },
  { label: 'JSON', value: 'json' },
] as const

const sourceDataTypeValues = sourceDataTypeOptions.map((option) => option.value)

interface FieldValue {
  sourceDataType?: typeof sourceDataTypeOptions[number]['value']
  sourceDataOrigin?: string
}

const ChartDataSourceConfigurationField = () => {
  const sdk = useSDK<FieldExtensionSDK>()
  const cma = useCMA()

  useEffect(() => {
    sdk.window.startAutoResizer()
  }, [])

  const [fieldValue, setFieldValue] = useState<FieldValue>(
    sdk.field.getValue() || {
      sourceDataType: 'csv',
      sourceDataValue: '',
    },
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
              'sourceDataType',
              event.target.value as FieldValue['sourceDataType'],
            )
          }}
        >
          {sourceDataTypeOptions.map((option) => (
            <Select.Option key={option.value} value={option.value}>
              {option.label}
            </Select.Option>
          ))}
        </Select>
      </Box>
      {fieldValue.sourceDataType === 'csv' && (
        <Box>
          <FormControl.Label>CSV url</FormControl.Label>
          <TextInput />
          <FormControl.HelpText>
            For example:
            https://docs.google.com/spreadsheets/.../export?format=csv
          </FormControl.HelpText>
        </Box>
      )}
      {fieldValue.sourceDataType === 'api' && (
        <Box>
          <FormControl.Label>
            Choose which API provides the data
          </FormControl.Label>
          {/* ChartDataSourceType */}
          {/* TODO: create select and iterate over shared enum here */}
        </Box>
      )}
      {fieldValue.sourceDataType === 'json' && (
        <Box>
          <FormControl.Label>
            Choose which API provides the data
          </FormControl.Label>
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
