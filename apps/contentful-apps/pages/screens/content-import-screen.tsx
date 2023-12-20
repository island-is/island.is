import { ChangeEvent, useEffect, useState } from 'react'
import { ContentTypeProps } from 'contentful-management'
import XLSX from 'xlsx'
import { PageExtensionSDK } from '@contentful/app-sdk'
import {
  Box,
  Button,
  Flex,
  FormControl,
  Grid,
  MenuDivider,
  Select,
  Spinner,
  Stack,
  Table,
  Text,
} from '@contentful/f36-components'
import { useCMA, useSDK } from '@contentful/react-apps-toolkit'

import { CONTENTFUL_ENVIRONMENT, CONTENTFUL_SPACE } from '../../constants'

const CONTENT_TYPES = ['price', 'supportQNA'] as const

type Data = string[][]

const capitalize = (value: string) => {
  if (value?.length < 1) return ''
  return value[0].toUpperCase() + value.slice(1)
}

const ContentImportScreen = () => {
  const sdk = useSDK<PageExtensionSDK>()
  const cma = useCMA()
  const [data, setData] = useState<Data>([])
  const [loadingFile, setLoadingFile] = useState(false)
  const [contentTypeData, setContentTypeData] = useState<ContentTypeProps>(null)
  const [selectedContentType, setSelectedContentType] =
    useState<typeof CONTENT_TYPES[number]>('price')
  const [tagOptions, setTagOptions] = useState([])
  const [selectedTag, setSelectedTag] = useState(null)
  const [fieldMapping, setFieldMapping] = useState<
    { from: string; to: string | null }[]
  >([])
  const [referenceFieldMapping, setReferenceFieldMapping] = useState<
    { from: string; to: string | null }[]
  >([])

  useEffect(() => {
    const fetchContentTypeData = async () => {
      const response = await cma.contentType.get({
        contentTypeId: selectedContentType,
        environmentId: CONTENTFUL_ENVIRONMENT,
        spaceId: CONTENTFUL_SPACE,
      })

      // TODO: handle multiple locales

      setFieldMapping(
        response.fields
          .filter(
            (field) => field.type === 'Symbol' || field.type === 'Integer',
          )
          .map((field) => {
            return {
              from: field.name,
              to: null,
            }
          }),
      )

      setReferenceFieldMapping(
        response.fields
          .filter(
            (field) => !(field.type === 'Symbol' || field.type === 'Integer'),
          )
          .map((field) => {
            return {
              from: field.name,
              to: null,
            }
          }),
      )

      setContentTypeData(response)
    }

    fetchContentTypeData()
  }, [cma.contentType, selectedContentType])

  useEffect(() => {
    const fetchTags = async () => {
      const response = await cma.tag.getMany({
        environmentId: CONTENTFUL_ENVIRONMENT,
        spaceId: CONTENTFUL_SPACE,
        query: {
          limit: 1000,
          'name[match]': 'owner-',
        },
      })

      setTagOptions(response.items.map((item) => item.name))
    }
    fetchTags()
  }, [cma.tag])

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event?.target?.files?.[0]
    if (!file) {
      return
    }

    const reader = new FileReader()

    reader.onload = (e) => {
      const workbook = XLSX.read(e.target.result, { type: 'binary' })
      /* Get the first sheet */
      const sheetName = workbook.SheetNames[0]
      const sheet = workbook.Sheets[sheetName]

      /* Convert the sheet data to JSON */
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 })
      setData(jsonData as Data)
      setLoadingFile(false)
    }

    reader.onerror = () => {
      setLoadingFile(false)
    }

    reader.readAsBinaryString(file)

    setLoadingFile(true)
  }

  const headCells = data?.[0] ?? []
  const bodyRows =
    data?.slice(1)?.filter((row) => row?.some((text) => text)) ?? []

  return (
    <Box padding="spacingXl">
      <Stack
        spacing="spacing2Xl"
        flexDirection="column"
        alignItems="flex-start"
      >
        <Flex gap="16px">
          <FormControl>
            <FormControl.Label>Content type</FormControl.Label>
            <Select
              id="content-type-select"
              name="content-type-select"
              value={selectedContentType}
              onChange={(ev) => {
                setSelectedContentType(
                  ev.target.value as typeof CONTENT_TYPES[number],
                )
              }}
            >
              {CONTENT_TYPES.map((type) => (
                <Select.Option key={type} value={type}>
                  {capitalize(type)}
                </Select.Option>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <FormControl.Label>Tag</FormControl.Label>
            <Select
              id="tag-select"
              name="tag-select"
              value={selectedTag}
              onChange={(ev) => {
                setSelectedTag(ev.target.value as typeof CONTENT_TYPES[number])
              }}
            >
              <Select.Option value={null}>-</Select.Option>
              {tagOptions.map((tag) => (
                <Select.Option key={tag} value={tag}>
                  {tag}
                </Select.Option>
              ))}
            </Select>
            <FormControl.HelpText>
              All imported entries will be tagged with this tag
            </FormControl.HelpText>
          </FormControl>
        </Flex>

        <Flex>
          <input type="file" accept=".xlsx" onChange={onFileChange} />
          {loadingFile && <Spinner />}
        </Flex>

        <Stack flexDirection="column" spacing="spacingL">
          {headCells.length > 0 &&
            fieldMapping.map(({ from, to }, index) => {
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

        {headCells.length > 0 &&
          referenceFieldMapping.length > 0 &&
          fieldMapping.length > 0 && <MenuDivider />}

        <Stack flexDirection="column" spacing="spacingL">
          {headCells.length > 0 &&
            referenceFieldMapping.map(({ from, to }, index) => {
              const key = `${from}-${to}`
              return (
                <Grid key={key} columns="1fr 1fr">
                  <Text>{from}</Text>
                  <Select
                    id={key}
                    name={key}
                    value={to}
                    onChange={(ev) => {
                      setReferenceFieldMapping((prev) => {
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

        <Flex fullWidth flexDirection="row" justifyContent="flex-end">
          <Button variant="primary" size="large">
            Import
          </Button>
        </Flex>

        <Table>
          <Table.Head>
            <Table.Row>
              {headCells.map((text) => (
                <Table.Cell key={text}>{text}</Table.Cell>
              ))}
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {bodyRows.map((row, index) => (
              <Table.Row key={index}>
                {(row ?? []).map((text) => (
                  <Table.Cell key={text}>{text}</Table.Cell>
                ))}
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Stack>
    </Box>
  )
}

export default ContentImportScreen
