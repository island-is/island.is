import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import {
  ContentFields,
  ContentTypeProps,
  KeyValueMap,
} from 'contentful-management'
import capitalize from 'lodash/capitalize'
import { PageExtensionSDK } from '@contentful/app-sdk'
import { FormControl, Select } from '@contentful/f36-components'
import { Stack } from '@contentful/f36-core'
import { useCMA, useSDK } from '@contentful/react-apps-toolkit'

import { sortAlpha } from '@island.is/shared/utils'

import { TITLE_SEARCH_POSTFIX } from '../../constants'
import { getContentfulEntries } from '../../utils'
import { extractContentType, isPrimitiveField } from './utils'

const ReferenceField = ({
  field,
  headCells,
  setReferenceFieldMapping,
}: {
  field: ReferenceFieldMappingProps['referenceFieldMapping'][number]
  headCells: string[]
  setReferenceFieldMapping: ReferenceFieldMappingProps['setReferenceFieldMapping']
}) => {
  const cma = useCMA()
  const [options, setOptions] = useState<{ label: string; value: string }[]>([])

  const contentType = extractContentType(field)

  useEffect(() => {
    const fetchEntries = async () => {
      const items = await getContentfulEntries(cma, contentType)
      setOptions(
        items
          .filter((item) => item.fields.title?.['is-IS'])
          .map((item) => ({
            label: item.fields.title?.['is-IS'],
            value: item.sys.id,
          }))
          .sort(sortAlpha('label')),
      )
    }
    fetchEntries()
  }, [cma, cma.entry, contentType])
  return (
    <FormControl>
      {contentType && (
        <FormControl.Label>
          {capitalize(contentType)} ({field.contentfulField.locale})
        </FormControl.Label>
      )}
      <Select
        isDisabled={options.length === 0}
        value={field.selectedId}
        onChange={(ev) => {
          setReferenceFieldMapping((prev) => {
            const index = prev.findIndex(
              (item) =>
                item.contentfulField.data.id ===
                  field.contentfulField.data.id &&
                item.contentfulField.locale === field.contentfulField.locale,
            )
            if (index < 0) {
              return prev
            }
            prev[index].selectedId = ev.target.value
            return [...prev]
          })
        }}
      >
        <Select.Option value="">-</Select.Option>
        {headCells?.map((text, i) => (
          <Select.Option key={i} value={`${text}${TITLE_SEARCH_POSTFIX}`}>
            Title search for {'"' + text + '"'}
          </Select.Option>
        ))}
        {options.map((option) => (
          <Select.Option key={option.value} value={option.value}>
            {option.label}
          </Select.Option>
        ))}
      </Select>
    </FormControl>
  )
}

export interface ReferenceFieldMappingProps {
  contentTypeData: ContentTypeProps
  headCells: string[]
  referenceFieldMapping: {
    contentfulField: {
      data: ContentFields<KeyValueMap>
      locale: string
    }
    selectedId: string
  }[]
  setReferenceFieldMapping: Dispatch<
    SetStateAction<ReferenceFieldMappingProps['referenceFieldMapping']>
  >
}

export const ReferenceFieldMapping = ({
  contentTypeData,
  referenceFieldMapping,
  headCells,
  setReferenceFieldMapping,
}: ReferenceFieldMappingProps) => {
  const sdk = useSDK<PageExtensionSDK>()

  useEffect(() => {
    if (!contentTypeData) return

    const updatedReferenceFieldMapping = []

    for (const field of contentTypeData.fields) {
      if (isPrimitiveField(field)) continue

      updatedReferenceFieldMapping.push({
        contentfulField: {
          data: field,
          locale: 'is-IS',
        },
        selectedId: '',
      })

      if (!field.localized) continue

      for (const locale of Object.keys(sdk.locales.names).filter(
        (locale) => locale !== 'is-IS',
      )) {
        updatedReferenceFieldMapping.push({
          contentfulField: {
            data: field,
            locale: locale,
          },
          selectedId: '',
        })
      }
    }

    setReferenceFieldMapping(updatedReferenceFieldMapping)
  }, [contentTypeData, sdk.locales.names, setReferenceFieldMapping])

  return (
    <FormControl>
      <Stack flexDirection="column" spacing="spacingXs" alignItems="flex-start">
        {referenceFieldMapping.map((field, index) => {
          return (
            <ReferenceField
              key={index}
              field={field}
              setReferenceFieldMapping={setReferenceFieldMapping}
              headCells={headCells}
            />
          )
        })}
      </Stack>
    </FormControl>
  )
}
