import { Dispatch, SetStateAction, useEffect } from 'react'
import {
  ContentFields,
  ContentTypeProps,
  KeyValueMap,
} from 'contentful-management'
import { FormControl, Select, Stack } from '@contentful/f36-components'
import { useSDK } from '@contentful/react-apps-toolkit'

import { SLUGIFIED } from '../../constants'
import { isPrimitiveField } from './utils'

export interface PrimitiveFieldMappingProps {
  headCells: string[]
  contentTypeData: ContentTypeProps
  primitiveFieldMappingState: {
    contentfulField: {
      data: ContentFields<KeyValueMap>
      locale: string
    }
    importFieldName: string
  }[]
  setPrimitiveFieldMappingState: Dispatch<
    SetStateAction<PrimitiveFieldMappingProps['primitiveFieldMappingState']>
  >
}

export const PrimitiveFieldMapping = ({
  headCells,
  contentTypeData,
  primitiveFieldMappingState,
  setPrimitiveFieldMappingState,
}: PrimitiveFieldMappingProps) => {
  const sdk = useSDK()
  useEffect(() => {
    const updatedprimitiveFieldMapping = []

    for (const field of contentTypeData.fields) {
      if (!isPrimitiveField(field)) continue

      updatedprimitiveFieldMapping.push({
        contentfulField: {
          data: field,
          locale: 'is-IS',
        },
        importFieldName: '',
      })

      if (!field.localized) continue

      for (const locale of Object.keys(sdk.locales.names).filter(
        (locale) => locale !== 'is-IS',
      )) {
        updatedprimitiveFieldMapping.push({
          contentfulField: {
            data: field,
            locale: locale,
          },
          importFieldName: '',
        })
      }
    }

    setPrimitiveFieldMappingState(updatedprimitiveFieldMapping)
  }, [contentTypeData, sdk.locales.names, setPrimitiveFieldMappingState])

  return (
    <FormControl>
      <Stack flexDirection="column" spacing="spacingXs" alignItems="flex-start">
        {primitiveFieldMappingState.map(
          ({ contentfulField, importFieldName }, index) => {
            const key = `${importFieldName}-${contentfulField.data.id}-${index}`
            return (
              <FormControl key={key}>
                <FormControl.Label>
                  {contentfulField.data.name} ({contentfulField.locale})
                </FormControl.Label>
                <Select
                  id={key}
                  name={key}
                  value={importFieldName}
                  onChange={(ev) => {
                    setPrimitiveFieldMappingState((prev) => {
                      const alreadyPresentIndex = prev.findIndex(
                        (e) => e.importFieldName === ev.target.value,
                      )
                      if (alreadyPresentIndex >= 0) {
                        prev[alreadyPresentIndex].importFieldName = undefined
                      }
                      prev[index].importFieldName = ev.target.value
                      return [...prev]
                    })
                  }}
                >
                  <Select.Option value="">-</Select.Option>
                  {headCells.map((text) => (
                    <Select.Option key={text} value={text}>
                      {text}
                    </Select.Option>
                  ))}
                  {primitiveFieldMappingState
                    .filter(
                      (field) =>
                        field.contentfulField.data.type === 'Symbol' &&
                        contentfulField.data.id !==
                          field.contentfulField.data.id &&
                        contentfulField.locale ===
                          field.contentfulField.locale &&
                        field.importFieldName,
                    )
                    .map((field, i) => (
                      <Select.Option
                        key={i}
                        value={`${field.importFieldName}${SLUGIFIED}`}
                      >
                        Slugified {'"' + field.importFieldName + '"'}
                      </Select.Option>
                    ))}
                </Select>
              </FormControl>
            )
          },
        )}
      </Stack>
    </FormControl>
  )
}
