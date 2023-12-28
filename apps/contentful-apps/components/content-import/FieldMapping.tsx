import { Dispatch, SetStateAction, useEffect } from 'react'
import {
  ContentFields,
  ContentTypeProps,
  KeyValueMap,
} from 'contentful-management'
import { FormControl, Select, Stack } from '@contentful/f36-components'
import { useSDK } from '@contentful/react-apps-toolkit'

import { isReferenceField } from './utils'

export interface FieldMappingProps {
  headCells: string[]
  contentTypeData: ContentTypeProps
  fieldMapping: {
    contentfulField: {
      data: ContentFields<KeyValueMap>
      locale: string
    }
    importFieldName: string
  }[]
  setFieldMapping: Dispatch<SetStateAction<FieldMappingProps['fieldMapping']>>
}

export const FieldMapping = ({
  headCells,
  contentTypeData,
  fieldMapping,
  setFieldMapping,
}: FieldMappingProps) => {
  const sdk = useSDK()
  useEffect(() => {
    const updatedFieldMapping = []

    for (const field of contentTypeData.fields) {
      if (isReferenceField(field)) continue

      updatedFieldMapping.push({
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
        updatedFieldMapping.push({
          contentfulField: {
            data: field,
            locale: locale,
          },
          importFieldName: '',
        })
      }
    }

    setFieldMapping(updatedFieldMapping)
  }, [contentTypeData, sdk.locales.names, setFieldMapping])

  return (
    <FormControl>
      <Stack flexDirection="column" spacing="spacingXs" alignItems="flex-start">
        {fieldMapping.map(({ contentfulField, importFieldName }, index) => {
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
                  setFieldMapping((prev) => {
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
                {fieldMapping
                  .filter(
                    (field) =>
                      field.contentfulField.data.type === 'Symbol' &&
                      contentfulField.data.id !==
                        field.contentfulField.data.id &&
                      contentfulField.locale === field.contentfulField.locale &&
                      field.importFieldName,
                  )
                  .map((field, i) => (
                    <Select.Option
                      key={i}
                      value={`${field.importFieldName}--slugified`}
                    >
                      Slugified {'"' + field.importFieldName + '"'}
                    </Select.Option>
                  ))}
              </Select>
            </FormControl>
          )
        })}
      </Stack>
    </FormControl>
  )
}
