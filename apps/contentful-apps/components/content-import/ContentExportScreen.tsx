import { useCallback, useEffect, useState } from 'react'
import { ContentTypeProps } from 'contentful-management'
import { PageExtensionSDK } from '@contentful/app-sdk'
import { Button, Flex, Radio, Spinner } from '@contentful/f36-components'
import { DownloadIcon } from '@contentful/f36-icons'
import { useCMA, useSDK } from '@contentful/react-apps-toolkit'

import { GridContainer } from '@island.is/island-ui/core'
import { sortAlpha } from '@island.is/shared/utils'

import { ValueSelect } from '../../components/content-import'
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
    orgSlug: string | null
    orgSlugEn: string | null
  }>({
    contentTypes: [],
    selectedContentTypeId: '',
    isExporting: false,
    tags: [],
    selectedTagId: '',
    exportType: 'contentType',
    orgSlug: null,
    orgSlugEn: null,
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

  useEffect(() => {
    if (!state.selectedTagId || state.exportType !== 'pages') return
    const fetchOrgSlugs = async () => {
      const response = await cma.entry.getMany({
        query: {
          content_type: 'organizationPage',
          'metadata.tags.sys.id[in]': state.selectedTagId,
          limit: 1,
        },
      })
      const org = response?.items?.[0]
      setState((prev) => ({
        ...prev,
        orgSlug: org?.fields?.slug?.[DEFAULT_LOCALE] ?? null,
        orgSlugEn: org?.fields?.slug?.['en'] ?? null,
      }))
    }
    fetchOrgSlugs()
  }, [cma.entry, state.selectedTagId, state.exportType])

  const exportContentTypeEntries = useCallback(async () => {
    const contentTypeId = state.selectedContentTypeId
    const entries = []
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
        const value = entry.fields[field.id]?.[sdk.locales.default]
        row.push(JSON.stringify(value ?? ''))
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
    const csvHeader = [
      'Type',
      'Title',
      'Contentful URL',
      'Web URL (is-IS)',
      'Web URL (en)',
      'Contentful Updated At',
      'Contentful Published At',
      'Contentful Created At',
    ]
    const csvBody: string[] = []

    const tagId = state.selectedTagId
    const orgSlug = state.orgSlug
    const orgSlugEn = state.orgSlugEn
    const chunkSize = 100

    const contentfulUrl = (entryId: string) =>
      `https://app.contentful.com/spaces/${sdk.ids.space}/environments/${sdk.ids.environment}/entries/${entryId}`

    const addRow = (
      type: string,
      title: string,
      entryId: string,
      webUrl: string,
      webUrlEn: string,
      updatedAt: string,
      publishedAt: string,
      createdAt: string,
    ) => {
      csvBody.push(
        [
          type,
          title,
          contentfulUrl(entryId),
          webUrl,
          webUrlEn,
          updatedAt,
          publishedAt,
          createdAt,
        ].join(CSV_DELIMITER),
      )
    }

    // Articles
    let skip = 0
    let total = Infinity
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
        const slug = entry.fields.slug?.[DEFAULT_LOCALE]
        const slugEn = entry.fields.slug?.['en']

        addRow(
          'article',
          entry.fields.title?.[DEFAULT_LOCALE] ?? '',
          entry.sys.id,
          slug ? `https://island.is/${slug}` : '',
          slugEn ? `https://island.is/en/${slugEn}` : '',
          entry.sys.updatedAt,
          entry.sys.publishedAt,
          entry.sys.createdAt,
        )

        const subArticleRefs: { sys: { id: string } }[] =
          entry.fields.subArticles?.[DEFAULT_LOCALE] ?? []
        if (!subArticleRefs.length) continue

        for (const subArticleRef of subArticleRefs) {
          const subArticle = await cma.entry.get({
            entryId: subArticleRef.sys.id,
          })
          if (
            !subArticle?.fields?.title?.[DEFAULT_LOCALE] ||
            !subArticle.sys.publishedAt
          )
            continue

          const subArticleSlug =
            subArticle.fields.url?.[DEFAULT_LOCALE]?.split('/').pop()
          const subArticleSlugEn = subArticle.fields.url?.['en']
            ?.split('/')
            .pop()

          addRow(
            'subArticle',
            subArticle.fields.title[DEFAULT_LOCALE] ?? '',
            subArticle.sys.id,
            slug && subArticleSlug
              ? `https://island.is/${slug}/${subArticleSlug}`
              : '',
            slugEn && subArticleSlugEn
              ? `https://island.is/en/${slugEn}/${subArticleSlugEn}`
              : '',
            subArticle.sys.updatedAt,
            subArticle.sys.publishedAt,
            subArticle.sys.createdAt,
          )
        }
      }
    }

    if (orgSlug) {
      // Organization subpages (top-level, no parent)
      skip = 0
      total = Infinity
      while (skip < total) {
        const response = await cma.entry.getMany({
          query: {
            content_type: 'organizationSubpage',
            'sys.publishedAt[exists]': true,
            'metadata.tags.sys.id[in]': tagId,
            limit: chunkSize,
            skip,
            'fields.organizationParentSubpage[exists]': false,
          },
        })
        total = response.total
        skip += chunkSize

        for (const entry of response.items) {
          const subpageSlug = entry.fields.slug?.[DEFAULT_LOCALE]
          const subpageSlugEn = entry.fields.slug?.['en']

          addRow(
            'organizationSubpage',
            entry.fields.title?.[DEFAULT_LOCALE] ?? '',
            entry.sys.id,
            subpageSlug ? `https://island.is/s/${orgSlug}/${subpageSlug}` : '',
            orgSlugEn && subpageSlugEn
              ? `https://island.is/en/o/${orgSlugEn}/${subpageSlugEn}`
              : '',
            entry.sys.updatedAt,
            entry.sys.publishedAt,
            entry.sys.createdAt,
          )
        }
      }

      // Organization parent subpages with their children
      skip = 0
      total = Infinity
      while (skip < total) {
        const response = await cma.entry.getMany({
          query: {
            content_type: 'organizationParentSubpage',
            'sys.publishedAt[exists]': true,
            'metadata.tags.sys.id[in]': tagId,
            limit: chunkSize,
            skip,
          },
        })
        total = response.total
        skip += chunkSize

        for (const parent of response.items) {
          const parentSlug = parent.fields.slug?.[DEFAULT_LOCALE]
          const parentSlugEn = parent.fields.slug?.['en']
          if (!parentSlug && !parentSlugEn) continue

          const subpageRefs: { sys: { id: string } }[] =
            parent.fields.pages?.[DEFAULT_LOCALE] ?? []
          for (const subpageRef of subpageRefs) {
            const subpage = await cma.entry.get({ entryId: subpageRef.sys.id })
            if (!subpage) continue

            const subpageSlug = subpage.fields.slug?.[DEFAULT_LOCALE]
            const subpageSlugEn = subpage.fields.slug?.['en']

            addRow(
              'organizationSubpage',
              subpage.fields.title?.[DEFAULT_LOCALE] ?? '',
              subpage.sys.id,
              parentSlug && subpageSlug
                ? `https://island.is/s/${orgSlug}/${parentSlug}/${subpageSlug}`
                : '',
              orgSlugEn && parentSlugEn && subpageSlugEn
                ? `https://island.is/en/o/${orgSlugEn}/${parentSlugEn}/${subpageSlugEn}`
                : '',
              subpage.sys.updatedAt,
              subpage.sys.publishedAt,
              subpage.sys.createdAt,
            )
          }
        }
      }
    }

    const csvContent = `${csvHeader.join(CSV_DELIMITER)}\n${csvBody.join('\n')}`
    const filename = `${tagId}-${new Date().toISOString().split('.')[0]}.csv`
    downloadCsv(csvContent, filename)
  }, [
    cma.entry,
    sdk.ids.environment,
    sdk.ids.space,
    state.selectedTagId,
    state.orgSlug,
    state.orgSlugEn,
  ])

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

  const canExport =
    !state.isExporting &&
    (state.exportType === 'contentType'
      ? Boolean(state.selectedContentTypeId)
      : Boolean(state.selectedTagId))

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
            id="contentTypeExportSelect"
            name="contentTypeExportSelect"
          />
        </Flex>
      )}
      {state.exportType === 'pages' && (
        <Flex gap="16px" flexDirection="column" marginBottom="spacingM">
          <ValueSelect
            id="tagExportSelect"
            name="tagExportSelect"
            disabled={state.isExporting}
            selectedValue={state.selectedTagId}
            setSelectedValue={(value) =>
              setState((prev) => ({
                ...prev,
                selectedTagId: value,
                orgSlug: null,
                orgSlugEn: null,
              }))
            }
            options={state.tags}
            label="Owner tag"
            placeholder="Select a tag"
          />
          {state.selectedTagId && (
            <Flex gap="8px" flexDirection="column">
              <span>
                Organization page slug ({DEFAULT_LOCALE}):{' '}
                <strong>{state.orgSlug ?? 'not found'}</strong>
              </span>
              <span>
                Organization page slug (en):{' '}
                <strong>{state.orgSlugEn ?? 'not found'}</strong>
              </span>
            </Flex>
          )}
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
