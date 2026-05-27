import { useCallback, useEffect, useState } from 'react'
import { ContentTypeProps, EntryProps } from 'contentful-management'
import { PageExtensionSDK } from '@contentful/app-sdk'
import { Button, Flex, Radio, Spinner } from '@contentful/f36-components'
import { DownloadIcon } from '@contentful/f36-icons'
import { useCMA, useSDK } from '@contentful/react-apps-toolkit'

import { GridContainer } from '@island.is/island-ui/core'
import { sortAlpha } from '@island.is/shared/utils'

import { ValueSelect } from '../..//components/content-import'
import { downloadCsv } from '../../components/content-import/utils'
import { DEFAULT_LOCALE } from '../../constants'

const CSV_DELIMITER = ';'

export const ContentExportScreen = () => {
  const cma = useCMA()
  const sdk = useSDK<PageExtensionSDK>()

  const [state, setState] = useState<{
    contentTypes: {
      label: string
      value: string
      contentType: ContentTypeProps
    }[]
    selectedContentTypeId: string
    isExporting: boolean
    tags: { label: string; value: string }[]
    selectedTagId: string | null
    exportType: 'contentType' | 'pages'
  }>({
    contentTypes: [],
    selectedContentTypeId: '',
    isExporting: false,
    tags: [],
    selectedTagId: '',
    exportType: 'contentType',
  })

  useEffect(() => {
    const fetchTags = async () => {
      const response = await cma.tag.getMany({
        query: {
          limit: 1000,
          'name[match]': 'owner-',
        },
      })
      setState((prev) => ({
        ...prev,
        tags: response.items
          .map((item) => ({
            label: item.name,
            value: item.sys.id,
          }))
          .sort(sortAlpha('label')),
      }))
    }
    const fetchContentTypes = async () => {
      const response = await cma.contentType.getMany({
        query: {
          limit: 1000,
        },
      })
      setState((prev) => ({
        ...prev,
        contentTypes: response.items
          .map((item) => ({
            label: item.name,
            value: item.sys.id,
            contentType: item,
          }))
          .sort(sortAlpha('label')),
      }))
    }
    fetchContentTypes()
    fetchTags()
  }, [cma])

  const exportContentTypeEntries = useCallback(async () => {
    const contentTypeId = state.selectedContentTypeId
    const entries: EntryProps[] = []
    let skip = 0
    let total = Infinity
    const chunkSize = 100
    while (skip < total) {
      const response = await cma.entry.getMany({
        query: {
          content_type: contentTypeId,
          limit: chunkSize,
          skip,
          'sys.archivedAt[exists]': false,
        },
      })
      total = response.total
      skip += chunkSize
      entries.push(...response.items)
    }

    const foundContentType = state.contentTypes.find(
      (type) => type.value === contentTypeId,
    )
    if (!foundContentType) throw new Error('Content type not found')

    const contentTypeFields = foundContentType.contentType.fields.filter(
      (field) => field.type !== 'RichText',
    )

    const csvHeader: string[] = [
      'Contentful URL',
      'Contentful Status',
      'Contentful Tags',
    ]

    for (const field of contentTypeFields) {
      csvHeader.push(`${field.name} (${sdk.locales.default})`)
      if (field.localized)
        for (const locale of sdk.locales.available)
          if (locale !== sdk.locales.default)
            csvHeader.push(`${field.name} (${locale})`)
    }

    csvHeader.push('Contentful Created At')
    csvHeader.push('Contentful Updated At')
    csvHeader.push('Contentful Published At')
    csvHeader.push('Contentful ID')

    const csvBody: string[] = []

    for (const entry of entries) {
      const row: string[] = []
      row.push(
        `https://app.contentful.com/spaces/${sdk.ids.space}/environments/${sdk.ids.environment}/entries/${entry.sys.id}`,
      )
      let entryStatus = 'Draft'
      if (entry.sys.updatedAt > entry.sys.publishedAt) entryStatus = 'Changed'
      else if (entry.sys.publishedAt) entryStatus = 'Published'
      row.push(entryStatus)

      row.push(entry.metadata.tags.map((tag) => tag.sys.id).join(','))

      for (const field of contentTypeFields) {
        {
          const value = entry.fields[field.id]?.[sdk.locales.default]
          row.push(JSON.stringify(value ?? ''))
        }
        if (field.localized)
          for (const locale of sdk.locales.available)
            if (locale !== sdk.locales.default) {
              const value = entry.fields[field.id]?.[locale]
              row.push(JSON.stringify(value ?? ''))
            }
      }
      row.push(entry.sys.createdAt ?? '')
      row.push(entry.sys.updatedAt ?? '')
      row.push(entry.sys.publishedAt ?? '')
      row.push(entry.sys.id)
      csvBody.push(row.join(CSV_DELIMITER))
    }

    const csvContent = `${csvHeader.join(CSV_DELIMITER)}\n${csvBody.join('\n')}`

    const filename = `${contentTypeId}-${new Date().toISOString()}.csv`
    downloadCsv(csvContent, filename)
  }, [
    cma.entry,
    sdk.ids.environment,
    sdk.ids.space,
    sdk.locales.available,
    sdk.locales.default,
    state.contentTypes,
    state.selectedContentTypeId,
  ])

  const exportPageEntries = useCallback(async () => {
    const csvBody: string[] = []
    const csvHeader: string[] = [
      'Contentful URL',
      'Contentful Status',
      'Contentful Tags',
      'Content Type',
      'Web URL (is-IS)',
      'Web URL (en)',
    ]

    csvHeader.push('Contentful Created At')
    csvHeader.push('Contentful Updated At')
    csvHeader.push('Contentful Published At')
    csvHeader.push('Contentful ID')

    const tagId = state.selectedTagId
    let skip = 0
    let total = Infinity
    const chunkSize = 100
    while (skip < total) {
      const response = await cma.entry.getMany({
        query: {
          content_type: 'article',
          'sys.publishedAt[exists]': true,
          'metadata.tags.sys.id[in]': tagId,
          limit: chunkSize,
          skip,
        },
      })

      total = response.total
      skip += chunkSize

      for (const entry of response.items) {
        const row: string[] = []
        row.push(
          `https://app.contentful.com/spaces/${sdk.ids.space}/environments/${sdk.ids.environment}/entries/${entry.sys.id}`,
        )
        let entryStatus = 'Draft'
        if (entry.sys.updatedAt > entry.sys.publishedAt) entryStatus = 'Changed'
        else if (entry.sys.publishedAt) entryStatus = 'Published'
        row.push(entryStatus)

        row.push(entry.metadata.tags.map((tag) => tag.sys.id).join(','))
        row.push(entry.sys.contentType.sys.id)
        row.push(
          entry.fields.slug?.[DEFAULT_LOCALE]
            ? `https://island.is/${entry.fields.slug?.[DEFAULT_LOCALE]}`
            : '',
        )
        row.push(
          entry.fields.slug?.['en']
            ? `https://island.is/en/${entry.fields.slug?.['en']}`
            : '',
        )

        row.push(entry.sys.createdAt ?? '')
        row.push(entry.sys.updatedAt ?? '')
        row.push(entry.sys.publishedAt ?? '')
        row.push(entry.sys.id)

        csvBody.push(row.join(CSV_DELIMITER))

        const subArticleIds: string[] =
          entry.fields.subArticles?.[DEFAULT_LOCALE]?.map(
            (subArticle) => subArticle.sys.id,
          ) ?? []

        if (!subArticleIds?.length) continue

        const subArticleRow: string[] = []
        const subResponse = await cma.entry.getMany({
          query: {
            content_type: 'subArticle',
            'sys.id[in]': subArticleIds.join(','),
            'sys.publishedAt[exists]': true,
          },
        })
        if (subResponse.items.length === 0) continue
        for (const subArticle of subResponse.items) {
          subArticleRow.push(subArticle.sys.id)
        }
        csvBody.push(subArticleRow.join(CSV_DELIMITER))
      }
    }
    const csvContent = `${csvHeader.join(CSV_DELIMITER)}\n${csvBody.join('\n')}`
    const filename = `${tagId}-${new Date().toISOString().split('.')[0]}.csv`
    downloadCsv(csvContent, filename)
  }, [cma.entry, sdk.ids.environment, sdk.ids.space, state.selectedTagId])

  const exportContent = useCallback(async () => {
    setState((prev) => ({ ...prev, isExporting: true }))
    try {
      if (state.exportType === 'contentType') await exportContentTypeEntries()
      else await exportPageEntries()
    } catch (error) {
      console.error(error)
      sdk.notifier.error('Error exporting content')
    } finally {
      setState((prev) => ({ ...prev, isExporting: false }))
    }
  }, [
    exportContentTypeEntries,
    exportPageEntries,
    state.exportType,
    sdk.notifier,
  ])

  if (state.contentTypes.length === 0)
    return (
      <GridContainer>
        <Spinner />
      </GridContainer>
    )

  let canExport = false

  if (!state.isExporting) {
    if (state.exportType === 'contentType')
      canExport = Boolean(state.selectedContentTypeId)
    else if (state.exportType === 'pages')
      canExport = Boolean(state.selectedTagId)
  }

  return (
    <GridContainer>
      <Flex gap="16px" flexWrap="wrap" marginBottom="spacingM">
        <Radio
          value="contentType"
          isChecked={state.exportType === 'contentType'}
          onChange={() =>
            setState((prev) => ({ ...prev, exportType: 'contentType' }))
          }
        >
          Export all entries of content type
        </Radio>
        <Radio
          value="pages"
          isChecked={state.exportType === 'pages'}
          onChange={() =>
            setState((prev) => ({ ...prev, exportType: 'pages' }))
          }
        >
          Export published page entries with specific tag
        </Radio>
      </Flex>
      {state.exportType === 'contentType' && (
        <Flex gap="16px" flexWrap="wrap">
          <ValueSelect
            disabled={state.isExporting}
            selectedValue={state.selectedContentTypeId}
            setSelectedValue={(value) =>
              setState((prev) => ({ ...prev, selectedContentTypeId: value }))
            }
            options={state.contentTypes}
            label="Content type"
            placeholder="Select a content type"
          />
        </Flex>
      )}
      {state.exportType === 'pages' && (
        <Flex gap="16px" flexWrap="wrap">
          <ValueSelect
            disabled={state.isExporting}
            selectedValue={state.selectedTagId}
            setSelectedValue={(value) =>
              setState((prev) => ({ ...prev, selectedTagId: value }))
            }
            options={state.tags}
            label="Owner tag"
            placeholder="Select a tag"
          />
        </Flex>
      )}
      <Button
        variant="primary"
        onClick={exportContent}
        isDisabled={!canExport}
        endIcon={state.isExporting ? <Spinner /> : <DownloadIcon />}
      >
        Export
      </Button>
    </GridContainer>
  )
}
