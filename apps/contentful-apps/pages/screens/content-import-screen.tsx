import { useCallback, useEffect, useMemo, useState } from 'react'
import { ContentTypeProps, EntryProps } from 'contentful-management'
import { NodeHtmlMarkdown } from 'node-html-markdown'
import { PageExtensionSDK } from '@contentful/app-sdk'
import {
  Accordion,
  Box,
  Button,
  Flex,
  FormControl,
  Select,
  Spinner,
  Stack,
  Tab,
  TabList,
  Tabs,
} from '@contentful/f36-components'
import { CloudUploadIcon, DownloadIcon } from '@contentful/f36-icons'
import { useCMA, useSDK } from '@contentful/react-apps-toolkit'
import { richTextFromMarkdown } from '@contentful/rich-text-from-markdown'

import { GridContainer } from '@island.is/island-ui/core'
import { sortAlpha } from '@island.is/shared/utils'

import {
  ContentTypeSelect,
  FileDataTable,
  FileInput,
  getTableData,
  PrimitiveFieldMapping,
  PrimitiveFieldMappingProps,
  ReferenceFieldMapping,
  ReferenceFieldMappingProps,
  TagSelect,
} from '../..//components/content-import'
import {
  extractContentType,
  FileData,
} from '../../components/content-import/utils'
import {
  CONTENTFUL_ENVIRONMENT,
  CONTENTFUL_SPACE,
  SLUGIFIED_POSTFIX,
  TITLE_SEARCH_POSTFIX,
} from '../../constants'
import { useContentTypeData } from '../../hooks/useContentTypeData'
import {
  getContentfulEntries,
  parseContentfulErrorMessage,
  slugify,
} from '../../utils'

const IMPORT_CONTENT_TYPES = [
  { label: 'Price', value: 'price' },
  { label: 'SupportQNA', value: 'supportQNA' },
]

const convertHtmlToContentfulRichText = (html: string) => {
  const markdown = NodeHtmlMarkdown.translate(html || '')
  return richTextFromMarkdown(markdown)
}

const ContentExportScreen = () => {
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
  }>({
    contentTypes: [],
    selectedContentTypeId: 'article',
    isExporting: false,
  })

  useEffect(() => {
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
  }, [cma])

  const exportContent = useCallback(async () => {
    const contentTypeId = state.selectedContentTypeId
    setState((prev) => ({ ...prev, isExporting: true }))
    try {
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

      const contentTypeFields = foundContentType.contentType.fields

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
      const delimiter = ';'

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
        csvBody.push(row.join(delimiter))
      }

      const csvContent = `${csvHeader.join(delimiter)}\n${csvBody.join('\n')}`

      const filename = `${contentTypeId}-${new Date().toISOString()}.csv`
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error(error)
      sdk.notifier.error('Error exporting content')
    } finally {
      setState((prev) => ({ ...prev, isExporting: false }))
    }
  }, [
    cma.entry,
    sdk.ids.environment,
    sdk.ids.space,
    sdk.locales.available,
    sdk.locales.default,
    sdk.notifier,
    state.contentTypes,
    state.selectedContentTypeId,
  ])

  if (state.contentTypes.length === 0)
    return (
      <GridContainer>
        <Spinner />
      </GridContainer>
    )

  return (
    <GridContainer>
      <Flex gap="16px" flexWrap="wrap">
        <ContentTypeSelect
          disabled={state.isExporting}
          selectedContentType={state.selectedContentTypeId}
          setSelectedContentType={(value) =>
            setState((prev) => ({ ...prev, selectedContentTypeId: value }))
          }
          contentTypes={state.contentTypes}
        />
      </Flex>
      <Button
        variant="primary"
        onClick={exportContent}
        isDisabled={
          !state.selectedContentTypeId ||
          state.contentTypes.length === 0 ||
          state.isExporting
        }
        endIcon={state.isExporting ? <Spinner /> : <DownloadIcon />}
      >
        Export
      </Button>
    </GridContainer>
  )
}

const ContentImportScreen = () => {
  const cma = useCMA()
  const sdk = useSDK<PageExtensionSDK>()

  // Rows and columns of the excel file
  const [fileData, setFileData] = useState<FileData>([])
  const { headCells, bodyRows } = useMemo(
    () => getTableData(fileData),
    [fileData],
  )

  const [selectedContentType, setSelectedContentType] = useState<
    typeof IMPORT_CONTENT_TYPES[number]['value']
  >(IMPORT_CONTENT_TYPES[0].value)
  const contentTypeData = useContentTypeData(selectedContentType)
  const [selectedTag, setSelectedTag] = useState('')

  const [primitiveFieldMappingState, setPrimitiveFieldMappingState] = useState<
    PrimitiveFieldMappingProps['primitiveFieldMappingState']
  >([])
  const [referenceFieldMapping, setReferenceFieldMapping] = useState<
    ReferenceFieldMappingProps['referenceFieldMapping']
  >([])

  const [uniqueFieldId, setUniqueFieldId] = useState('')

  // Import progress state
  const [successfulImports, setSuccessfulImports] = useState([])
  const [publishFailedImports, setPublishFailedImports] = useState([])
  const [failedImports, setFailedImports] = useState([])

  const importContent = async () => {
    // Reset progress state
    setSuccessfulImports([])
    setFailedImports([])
    setPublishFailedImports([])

    // Go through each row in the file
    for (let rowIndex = 0; rowIndex < bodyRows.length; rowIndex += 1) {
      const { row } = bodyRows[rowIndex]
      const fields = {}

      // Handle primitive fields
      for (let i = 0; i < row.length; i += 1) {
        const field = primitiveFieldMappingState.find((field) => {
          return field.importFieldName === headCells[i]
        })
        if (!field?.contentfulField?.data?.id) continue

        fields[field.contentfulField.data.id] = {
          ...fields[field.contentfulField.data.id],
          [field.contentfulField.locale]:
            field.contentfulField.data.type === 'RichText'
              ? await convertHtmlToContentfulRichText(row[i])
              : row[i],
        }
      }

      // There's an option to use a slugified version of a value so we handle that here
      for (let i = 0; i < row.length; i += 1) {
        const field = primitiveFieldMappingState.find((field) => {
          return field.importFieldName === headCells[i] + SLUGIFIED_POSTFIX
        })
        if (!field?.contentfulField?.data?.id || !row[i]) continue

        fields[field.contentfulField.data.id] = {
          ...fields[field.contentfulField.data.id],
          [field.contentfulField.locale]: slugify(row[i]),
        }
      }

      // Handle reference fields
      for (const referenceField of referenceFieldMapping) {
        if (
          !referenceField?.contentfulField?.data?.id ||
          !referenceField?.selectedId
        ) {
          continue
        }

        // The file can contain a title of the entry we want to reference
        if (referenceField.selectedId.includes(TITLE_SEARCH_POSTFIX)) {
          const headCellName =
            referenceField.selectedId.split(TITLE_SEARCH_POSTFIX)[0]
          const index = headCells.findIndex((name) => name === headCellName)

          if (index >= 0) {
            const entries = await getContentfulEntries(
              cma,
              extractContentType(referenceField),
              {
                'fields.title': row[index],
              },
            )
            if (entries.length > 0) {
              fields[referenceField.contentfulField.data.id] = {
                ...fields[referenceField.contentfulField.data.id],
                [referenceField.contentfulField.locale]: {
                  sys: {
                    id: entries[0].sys.id,
                    linkType: 'Entry',
                  },
                },
              }
            }
          }
        } else {
          fields[referenceField.contentfulField.data.id] = {
            ...fields[referenceField.contentfulField.data.id],
            [referenceField.contentfulField.locale]: {
              sys: {
                id: referenceField.selectedId,
                linkType: 'Entry',
              },
            },
          }
        }
      }

      try {
        let entry: EntryProps
        let shouldCreateEntry = true

        const uniqueFieldImportFieldName = primitiveFieldMappingState.find(
          (f) => uniqueFieldId && f.contentfulField.data.id === uniqueFieldId,
        )?.importFieldName
        const uniqueFieldRowIndex = headCells.findIndex(
          (cellName) => cellName === uniqueFieldImportFieldName,
        )

        // In case there's a unique field we can match on we'll look to see if an entry already exists
        // and if so we'll edit that instead of creating a new one
        if (
          uniqueFieldId &&
          uniqueFieldRowIndex >= 0 &&
          row[uniqueFieldRowIndex]
        ) {
          const matchedEntries = await cma.entry.getMany({
            environmentId: CONTENTFUL_ENVIRONMENT,
            spaceId: CONTENTFUL_SPACE,
            query: {
              content_type: selectedContentType,
              [`fields.${uniqueFieldId}`]: row[uniqueFieldRowIndex],
            },
          })

          if (matchedEntries.items.length > 0) {
            shouldCreateEntry = false // We don't want to create the entry since we found it already exists
            entry = await cma.entry.update(
              {
                environmentId: CONTENTFUL_ENVIRONMENT,
                spaceId: CONTENTFUL_SPACE,
                entryId: matchedEntries.items[0].sys.id,
              },
              {
                sys: {
                  ...matchedEntries.items[0].sys,
                },
                fields,
                metadata: {
                  tags: selectedTag
                    ? [
                        {
                          sys: {
                            type: 'Link',
                            linkType: 'Tag',
                            id: selectedTag,
                          },
                        },
                      ]
                    : [],
                },
              },
            )
          }
        }

        if (shouldCreateEntry) {
          entry = await cma.entry.create(
            {
              contentTypeId: selectedContentType,
              environmentId: CONTENTFUL_ENVIRONMENT,
              spaceId: CONTENTFUL_SPACE,
            },
            {
              fields,
              metadata: {
                tags: selectedTag
                  ? [
                      {
                        sys: {
                          type: 'Link',
                          linkType: 'Tag',
                          id: selectedTag,
                        },
                      },
                    ]
                  : [],
              },
            },
          )
        }

        try {
          await cma.entry.publish(
            {
              entryId: entry.sys.id,
              environmentId: CONTENTFUL_ENVIRONMENT,
              spaceId: CONTENTFUL_SPACE,
            },
            entry,
          )
        } catch (error) {
          const errorMessage = parseContentfulErrorMessage(error)
          setPublishFailedImports((prev) => [
            ...prev,
            {
              row,
              id: entry.sys.id,
              errorMessage,
            },
          ])
          continue
        }
        setSuccessfulImports((prev) => [...prev, { row, id: entry.sys.id }])
      } catch (error) {
        const errorMessage = parseContentfulErrorMessage(error)
        setFailedImports((prev) => [...prev, { row, errorMessage }])
        continue
      }
    }

    sdk.notifier.success('Import completed')
  }

  const canImport =
    Boolean(bodyRows?.length) &&
    primitiveFieldMappingState.every(
      (field) =>
        (field.contentfulField.data.required && field.importFieldName) ||
        !field.contentfulField.data.required,
    ) &&
    referenceFieldMapping.every(
      (field) =>
        (field.contentfulField.data.required && field.selectedId) ||
        !field.contentfulField.data.required,
    )

  return (
    <Box id="content-import-screen-container">
      <Stack
        spacing="spacing2Xl"
        flexDirection="column"
        alignItems="flex-start"
      >
        <GridContainer>
          <Stack
            spacing="spacing2Xl"
            flexDirection="column"
            alignItems="flex-start"
          >
            <Flex fullWidth justifyContent="space-between">
              <FileInput setFileData={setFileData} />
              <Button
                variant="primary"
                onClick={importContent}
                isDisabled={!canImport}
                endIcon={<CloudUploadIcon />}
              >
                Import
              </Button>
            </Flex>

            <Flex gap="16px" flexWrap="wrap">
              <ContentTypeSelect
                selectedContentType={selectedContentType}
                setSelectedContentType={setSelectedContentType}
                contentTypes={IMPORT_CONTENT_TYPES}
              />
              <TagSelect
                selectedTag={selectedTag}
                setSelectedTag={setSelectedTag}
              />
              {contentTypeData?.fields?.length > 0 && (
                <FormControl>
                  <FormControl.Label>Unique field mapping</FormControl.Label>
                  <Select
                    value={uniqueFieldId}
                    onChange={(ev) => {
                      setUniqueFieldId(ev.target.value)
                    }}
                  >
                    <Select.Option value="">-</Select.Option>
                    {contentTypeData.fields.map((f, i) => (
                      <Select.Option key={i} value={f.id}>
                        {f.name}
                      </Select.Option>
                    ))}
                  </Select>
                  <FormControl.HelpText>
                    If selected then matching entries will be edited instead of
                    created
                  </FormControl.HelpText>
                </FormControl>
              )}
            </Flex>

            {fileData?.length > 0 && (
              <PrimitiveFieldMapping
                contentTypeData={contentTypeData}
                primitiveFieldMappingState={primitiveFieldMappingState}
                headCells={headCells}
                setPrimitiveFieldMappingState={setPrimitiveFieldMappingState}
              />
            )}

            {fileData?.length > 0 && (
              <ReferenceFieldMapping
                contentTypeData={contentTypeData}
                referenceFieldMapping={referenceFieldMapping}
                setReferenceFieldMapping={setReferenceFieldMapping}
                headCells={headCells}
              />
            )}
          </Stack>
        </GridContainer>

        <GridContainer>
          {successfulImports.length > 0 && (
            <Accordion>
              <Accordion.Item
                title={`✅ ${successfulImports.length}/${bodyRows.length} were imported and published successfully`}
              >
                <FileDataTable
                  bodyRows={successfulImports}
                  headCells={headCells}
                />
              </Accordion.Item>
            </Accordion>
          )}
          {publishFailedImports.length > 0 && (
            <Accordion>
              <Accordion.Item
                title={`⚠️ ${publishFailedImports.length}/${bodyRows.length} entries were imported but could not
              be published`}
              >
                <FileDataTable
                  bodyRows={publishFailedImports}
                  headCells={headCells}
                />
              </Accordion.Item>
            </Accordion>
          )}
          {failedImports.length > 0 && (
            <Accordion>
              <Accordion.Item
                title={`❌ ${failedImports.length}/${bodyRows.length} entries could not
               be imported`}
              >
                <FileDataTable bodyRows={failedImports} headCells={headCells} />
              </Accordion.Item>
            </Accordion>
          )}
        </GridContainer>
        <FileDataTable bodyRows={bodyRows} headCells={headCells} />
      </Stack>
    </Box>
  )
}

const Screen = () => {
  const [selectedScreen, setSelectedScreen] = useState<'import' | 'export'>(
    'import',
  )
  return (
    <Box paddingLeft="spacingXl" paddingRight="spacingXl" paddingTop="spacingM">
      <Box paddingBottom="spacingXl">
        <GridContainer>
          <Tabs
            onTabChange={(tab) => setSelectedScreen(tab as 'import' | 'export')}
            defaultTab="import"
          >
            <TabList>
              <Tab panelId="import">Import</Tab>
              <Tab panelId="export">Export</Tab>
            </TabList>
          </Tabs>
        </GridContainer>
      </Box>
      {selectedScreen === 'import' && <ContentImportScreen />}
      {selectedScreen === 'export' && <ContentExportScreen />}
    </Box>
  )
}

export default Screen
