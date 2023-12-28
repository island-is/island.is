import { useMemo, useState } from 'react'
import { NodeHtmlMarkdown } from 'node-html-markdown'
import { PageExtensionSDK } from '@contentful/app-sdk'
import { Box, Button, Flex, Stack, Text } from '@contentful/f36-components'
import { useCMA, useSDK } from '@contentful/react-apps-toolkit'
import { richTextFromMarkdown } from '@contentful/rich-text-from-markdown'
import slugify from '@sindresorhus/slugify'

import { GridContainer } from '@island.is/island-ui/core'

import {
  ContentTypeSelect,
  FieldMapping,
  FieldMappingProps,
  FileDataTable,
  FileInput,
  getTableData,
  ReferenceFieldMapping,
  ReferenceFieldMappingProps,
  TagSelect,
} from '../..//components/content-import'
import { FileData } from '../../components/content-import/utils'
import { CONTENTFUL_ENVIRONMENT, CONTENTFUL_SPACE } from '../../constants'
import { useContentTypeData } from '../../hooks/useContentTypeData'

const convertHtmlToContentfulRichText = (html: string) => {
  const markdown = NodeHtmlMarkdown.translate(html)
  return richTextFromMarkdown(markdown)
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
  const [successfulImports, setSuccessfulImports] = useState([])
  const [publishFailedImports, setPublishFailedImports] = useState([])
  const [failedImports, setFailedImports] = useState([])

  const importContent = async () => {
    for (let rowIndex = 0; rowIndex < bodyRows.length; rowIndex += 1) {
      const row = bodyRows[rowIndex]
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
        if (!field?.contentfulField?.data?.id) continue

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

      try {
        const createdEntry = await cma.entry.create(
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
        try {
          await cma.entry.publish(
            {
              entryId: createdEntry.sys.id,
              environmentId: CONTENTFUL_ENVIRONMENT,
              spaceId: CONTENTFUL_SPACE,
            },
            createdEntry,
          )
        } catch (err) {
          setPublishFailedImports((prev) => prev.concat(rowIndex))
          continue
        }
        setSuccessfulImports((prev) => prev.concat(rowIndex))
      } catch (err) {
        setFailedImports((prev) => prev.concat(rowIndex))
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

            <Flex gap="16px">
              <ContentTypeSelect
                selectedContentType={selectedContentType}
                setSelectedContentType={setSelectedContentType}
              />
              <TagSelect
                selectedTag={selectedTag}
                setSelectedTag={setSelectedTag}
              />
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
              />
            )}
          </Stack>
        </GridContainer>

        {successfulImports.length > 0 && (
          <Text>
            {successfulImports.length}/{bodyRows.length} successful imports
          </Text>
        )}

        <FileDataTable
          data={data}
          failedRowIndexes={failedImports}
          publishFailedRowIndexes={publishFailedImports}
          successfulRowIndexes={successfulImports}
        />
      </Stack>
    </Box>
  )
}

export default ContentImportScreen
