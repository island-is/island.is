import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import {
  CollectionProp,
  ContentFields,
  ContentTypeProps,
  EntryProps,
  KeyValueMap,
} from 'contentful-management'
import capitalize from 'lodash/capitalize'
import { CMAClient, PageExtensionSDK } from '@contentful/app-sdk'
import { FormControl, Select } from '@contentful/f36-components'
import { Stack } from '@contentful/f36-core'
import { useCMA, useSDK } from '@contentful/react-apps-toolkit'

import { sortAlpha } from '@island.is/shared/utils'

import { CONTENTFUL_ENVIRONMENT, CONTENTFUL_SPACE } from '../../constants'
import { isReferenceField } from './utils'

const getContentfulEntries = async (cma: CMAClient, contentType: string) => {
  const items: EntryProps<KeyValueMap>[] = []
  let response: CollectionProp<EntryProps<KeyValueMap>> | null = null

  let chunkSize = 1000

  while (
    chunkSize > 0 &&
    (response === null || items.length < response.total)
  ) {
    try {
      response = await cma.entry.getMany({
        environmentId: CONTENTFUL_ENVIRONMENT,
        spaceId: CONTENTFUL_SPACE,
        query: {
          content_type: contentType,
          limit: chunkSize,
          skip: items.length,
        },
      })
      for (const item of response.items) {
        items.push(item)
      }
    } catch (error: unknown) {
      if (
        ((error as { message?: string })?.message as string)
          ?.toLowerCase()
          ?.includes('response size too big')
      ) {
        chunkSize = Math.floor(chunkSize / 2)
      } else {
        return items
      }
    }
  }

  return items
}

const extractContentType = (
  field: ReferenceFieldMappingProps['referenceFieldMapping'][number],
) => {
  let validations = field.contentfulField.data.validations ?? []

  if (validations.length === 0) {
    validations = field.contentfulField.data.items.validations ?? []
  }

  return validations.find((v) => v?.linkContentType)?.linkContentType?.[0] ?? ''
}

const ReferenceField = ({
  field,
}: {
  field: ReferenceFieldMappingProps['referenceFieldMapping'][number]
}) => {
  const cma = useCMA()
  const [options, setOptions] = useState<{ label: string; value: string }[]>([])
  const [selectedOption, setSelectedOption] = useState('')

  const contentType = extractContentType(field)

  useEffect(() => {
    const fetchEntries = async () => {
      const items = await getContentfulEntries(cma, contentType)
      console.log(items)
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
        value={selectedOption}
        onChange={(ev) => {
          setSelectedOption(ev.target.value)
        }}
      >
        <Select.Option value="">-</Select.Option>
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
  referenceFieldMapping: {
    contentfulField: {
      data: ContentFields<KeyValueMap>
      locale: string
    }
    importFieldName: string
  }[]
  setReferenceFieldMapping: Dispatch<
    SetStateAction<ReferenceFieldMappingProps['referenceFieldMapping']>
  >
}

export const ReferenceFieldMapping = ({
  contentTypeData,
  referenceFieldMapping,
  setReferenceFieldMapping,
}: ReferenceFieldMappingProps) => {
  const sdk = useSDK<PageExtensionSDK>()

  useEffect(() => {
    if (!contentTypeData) return

    const updatedReferenceFieldMapping = []

    for (const field of contentTypeData.fields) {
      if (!isReferenceField(field)) continue

      updatedReferenceFieldMapping.push({
        contentfulField: {
          data: field,
          locale: 'is-IS',
        },
        importFieldName: '',
      })

      for (const locale of Object.keys(sdk.locales.names).filter(
        (locale) => locale !== 'is-IS',
      )) {
        updatedReferenceFieldMapping.push({
          contentfulField: {
            data: field,
            locale: locale,
          },
          importFieldName: '',
        })
      }
    }

    setReferenceFieldMapping(updatedReferenceFieldMapping)
  }, [contentTypeData, sdk.locales.names, setReferenceFieldMapping])

  return (
    <FormControl>
      <Stack flexDirection="column" spacing="spacingXs" alignItems="flex-start">
        {referenceFieldMapping.map((field, index) => {
          return <ReferenceField key={index} field={field} />
        })}
      </Stack>
    </FormControl>
  )
}
