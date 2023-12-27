import { useMemo, useState } from 'react'
import { Box, Button, Flex, Stack } from '@contentful/f36-components'
import { useCMA, useSDK } from '@contentful/react-apps-toolkit'

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

const ContentImportScreen = () => {
  const [data, setData] = useState<FileData>([])
  const { headCells, bodyRows } = useMemo(() => getTableData(data), [data])
  const cma = useCMA()
  const sdk = useSDK()

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

  const importContent = async () => {
    for (const row of bodyRows) {
      const fields = {}
      for (let i = 0; i < row.length; i += 1) {
        const field = fieldMapping.find(
          (field) => field.importFieldName === headCells[i],
        )?.contentfulField
        if (!field?.data?.id) continue

        if (field.data.localized) {
          for (const locale of Object.keys(sdk.locales.names)) {
            // fields[field.id] = {
            // }
            console.log(locale)
          }
        }
      }

      const createdEntry = await cma.entry.create(
        {
          contentTypeId: selectedContentType,
          environmentId: CONTENTFUL_ENVIRONMENT,
          spaceId: CONTENTFUL_SPACE,
        },
        {
          fields,
          metadata: {
            tags: [
              {
                sys: {
                  type: 'Link',
                  linkType: 'Tag',
                  id: selectedTag,
                },
              },
            ],
          },
        },
      )

      await cma.entry.publish(
        {
          entryId: createdEntry.sys.id,
          environmentId: CONTENTFUL_ENVIRONMENT,
          spaceId: CONTENTFUL_SPACE,
        },
        createdEntry,
      )
    }
  }

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
              <Button variant="primary" onClick={importContent}>
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

        <FileDataTable data={data} />
      </Stack>
    </Box>
  )
}

export default ContentImportScreen
