import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'
import { ContentTypeProps } from 'contentful-management'
import { PageExtensionSDK } from '@contentful/app-sdk'
import {
  Box,
  Button,
  Flex,
  FormControl,
  Grid,
  Select,
  Stack,
  Text,
} from '@contentful/f36-components'
import { useCMA, useSDK } from '@contentful/react-apps-toolkit'

import { GridContainer } from '@island.is/island-ui/core'

import {
  ContentTypeSelect,
  FileDataTable,
  FileInput,
  getTableData,
  ReferenceFieldMapping,
  TagSelect,
} from '../..//components/content-import'
import {
  FileData,
  isReferenceField,
} from '../../components/content-import/utils'
import { useContentTypeData } from '../../hooks/useContentTypeData'

interface FieldMappingProps {
  headCells: string[]
  contentTypeData: ContentTypeProps
  fieldMapping: { from: string; to: string }[]
  setFieldMapping: Dispatch<SetStateAction<FieldMappingProps['fieldMapping']>>
}

const FieldMapping = ({
  headCells,
  contentTypeData,
  fieldMapping,
  setFieldMapping,
}: FieldMappingProps) => {
  useEffect(() => {
    if (!contentTypeData) return
    setFieldMapping(
      contentTypeData.fields
        .filter((field) => !isReferenceField(field))
        .map((field) => {
          return {
            from: field.name,
            to: '',
          }
        }),
    )
  }, [contentTypeData, setFieldMapping])
  return (
    <FormControl>
      <FormControl.Label>Fields</FormControl.Label>
      <Stack flexDirection="column" spacing="spacingL">
        {fieldMapping.map(({ from, to }, index) => {
          const key = `${from}-${to}`
          return (
            <Grid key={key} columns="1fr 1fr">
              <Text>{from}</Text>
              <Select
                id={key}
                name={key}
                value={to}
                onChange={(ev) => {
                  setFieldMapping((prev) => {
                    const alreadyPresentIndex = prev.findIndex(
                      (e) => e.to === ev.target.value,
                    )
                    if (alreadyPresentIndex >= 0) {
                      prev[alreadyPresentIndex].to = undefined
                    }
                    prev[index].to = ev.target.value
                    return [...prev]
                  })
                }}
              >
                <Select.Option value={null}>-</Select.Option>
                {headCells.map((text) => (
                  <Select.Option key={text} value={text}>
                    {text}
                  </Select.Option>
                ))}
              </Select>
            </Grid>
          )
        })}
      </Stack>
    </FormControl>
  )
}

const ContentImportScreen = () => {
  const sdk = useSDK<PageExtensionSDK>()
  const cma = useCMA()
  const [data, setData] = useState<FileData>([])
  const { headCells } = useMemo(() => getTableData(data), [data])

  const [selectedContentType, setSelectedContentType] = useState<
    'price' | 'supportQNA'
  >('price')
  const contentTypeData = useContentTypeData(selectedContentType)
  const [selectedTag, setSelectedTag] = useState('')
  const [fieldMapping, setFieldMapping] = useState<
    { from: string; to: string | null }[]
  >([])
  const [referenceFieldMapping, setReferenceFieldMapping] = useState<
    { from: string; to: string | null }[]
  >([])

  return (
    <Box padding="spacingXl">
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
              <Button variant="primary">Import</Button>
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

            <FileDataTable data={data} />
          </Stack>
        </GridContainer>
      </Stack>
    </Box>
  )
}

export default ContentImportScreen
