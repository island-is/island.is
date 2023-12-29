import { useMemo, useState } from 'react'
import { EntryProps } from 'contentful-management'
import { NodeHtmlMarkdown } from 'node-html-markdown'
import { PageExtensionSDK } from '@contentful/app-sdk'
import {
  Accordion,
  Box,
  Button,
  Flex,
  FormControl,
  Select,
  Stack,
} from '@contentful/f36-components'
import { useCMA, useSDK } from '@contentful/react-apps-toolkit'
import { richTextFromMarkdown } from '@contentful/rich-text-from-markdown'
import slugify from '@sindresorhus/slugify'

import { GridContainer } from '@island.is/island-ui/core'

import {
  ContentTypeSelect,
  extractContentType,
  FieldMapping,
  FieldMappingProps,
  FileDataTable,
  FileInput,
  getContentfulEntries,
  getTableData,
  ReferenceFieldMapping,
  ReferenceFieldMappingProps,
  TagSelect,
} from '../..//components/content-import'
import { FileData } from '../../components/content-import/utils'
import { CONTENTFUL_ENVIRONMENT, CONTENTFUL_SPACE } from '../../constants'
import { useContentTypeData } from '../../hooks/useContentTypeData'

const convertHtmlToContentfulRichText = (html: string) => {
  const markdown = NodeHtmlMarkdown.translate(html || '')
  return richTextFromMarkdown(markdown)
}

const parseErrorMessage = (error: unknown) => {
  let errorMessage = ''
  try {
    const errorObject = JSON.parse((error as { message: string })?.message)
      ?.details?.errors?.[0]
    errorMessage = `${errorObject?.details ?? ''}${
      errorObject?.value ? ' - value: ' + errorObject.value : ''
    }`
  } catch (_) {
    // Do nothing in case an error occurs during JSON.parse()
  }
  return errorMessage
}

const ContentImportScreen = () => {
  const [data, setData] = useState<FileData>([])
  const { headCells, bodyRows } = useMemo(() => getTableData(data), [data])
  const cma = useCMA()
  const sdk = useSDK<PageExtensionSDK>()

  const [selectedContentType, setSelectedContentType] = useState<
    'price' | 'supportQNA'
  >('price')
  const contentTypeData = useContentTypeData(selectedContentType)
  const [selectedTag, setSelectedTag] = useState('')
  const [fieldMapping, setFieldMapping] = useState<
    FieldMappingProps['fieldMapping']
  >([])
  const [referenceFieldMapping, setReferenceFieldMapping] = useState<
    ReferenceFieldMappingProps['referenceFieldMapping']
  >([])
  const [uniqueFieldId, setUniqueFieldId] = useState('')
  const [successfulImports, setSuccessfulImports] = useState([])
  const [publishFailedImports, setPublishFailedImports] = useState([])
  const [failedImports, setFailedImports] = useState([])

  const importContent = async () => {
    setSuccessfulImports([])
    setFailedImports([])
    setPublishFailedImports([])
    for (let rowIndex = 0; rowIndex < bodyRows.length; rowIndex += 1) {
      const { row } = bodyRows[rowIndex]
      const fields = {}
      for (let i = 0; i < row.length; i += 1) {
        const field = fieldMapping.find((field) => {
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

      // Handle slugified values
      for (let i = 0; i < row.length; i += 1) {
        const field = fieldMapping.find((field) => {
          return field.importFieldName === headCells[i] + '--slugified'
        })
        if (!field?.contentfulField?.data?.id || !row[i]) continue

        fields[field.contentfulField.data.id] = {
          ...fields[field.contentfulField.data.id],
          [field.contentfulField.locale]: slugify(row[i], {
            customReplacements: [['ö', 'o']],
          }),
        }
      }

      for (const referenceField of referenceFieldMapping) {
        if (
          !referenceField?.contentfulField?.data?.id ||
          !referenceField?.selectedId
        ) {
          continue
        }

        // Handle title searches
        if (referenceField.selectedId.includes('--title-search')) {
          const headCellName =
            referenceField.selectedId.split('--title-search')[0]
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
        let createdEntry: EntryProps

        const fa = fieldMapping.find(
          (f) => uniqueFieldId && f.contentfulField.data.id === uniqueFieldId,
        )?.importFieldName

        const a = headCells.findIndex((b) => b === fa)

        if (uniqueFieldId && a >= 0 && row[a]) {
          const matchedEntries = await cma.entry.getMany({
            environmentId: CONTENTFUL_ENVIRONMENT,
            spaceId: CONTENTFUL_SPACE,
            query: {
              content_type: selectedContentType,
              [`fields.${uniqueFieldId}`]: row[a],
            },
          })

          if (matchedEntries.items.length > 0) {
            createdEntry = await cma.entry.update(
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
          } else {
            createdEntry = await cma.entry.create(
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
        } else {
          createdEntry = await cma.entry.create(
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
              entryId: createdEntry.sys.id,
              environmentId: CONTENTFUL_ENVIRONMENT,
              spaceId: CONTENTFUL_SPACE,
            },
            createdEntry,
          )
        } catch (error) {
          const errorMessage = parseErrorMessage(error)

          setPublishFailedImports((prev) => [
            ...prev,
            {
              row,
              id: createdEntry.sys.id,
              errorMessage,
            },
          ])
          continue
        }
        setSuccessfulImports((prev) => [
          ...prev,
          { row, id: createdEntry.sys.id },
        ])
      } catch (error) {
        const errorMessage = parseErrorMessage(error)
        setFailedImports((prev) => [...prev, { row, errorMessage }])
        continue
      }
    }

    sdk.notifier.success('Import completed')
  }

  const canImport =
    Boolean(bodyRows?.length) &&
    fieldMapping.every(
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
    <Box padding="spacingXl" id="content-import-screen-container">
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
              <FileInput setFileData={setData} />
              <Button
                variant="primary"
                onClick={importContent}
                isDisabled={!canImport}
              >
                Import
              </Button>
            </Flex>

            <Flex gap="16px" flexWrap="wrap">
              <ContentTypeSelect
                selectedContentType={selectedContentType}
                setSelectedContentType={setSelectedContentType}
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

            {data?.length > 0 && (
              <FieldMapping
                contentTypeData={contentTypeData}
                fieldMapping={fieldMapping}
                headCells={headCells}
                setFieldMapping={setFieldMapping}
              />
            )}

            {data?.length > 0 && (
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
                title={`${successfulImports.length}/${bodyRows.length} were imported and published successfully`}
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
                title={`${publishFailedImports.length}/${bodyRows.length} entries were imported but could not
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
                title={`${failedImports.length}/${bodyRows.length} entries could not
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

export default ContentImportScreen
