import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { ContentTypeProps } from 'contentful-management'
import XLSX from 'xlsx'
import { PageExtensionSDK } from '@contentful/app-sdk'
import {
  Box,
  Button,
  Flex,
  FormControl,
  Grid,
  Select,
  Spinner,
  Stack,
  Table,
  Text,
} from '@contentful/f36-components'
import { useCMA, useSDK } from '@contentful/react-apps-toolkit'

import { CONTENTFUL_ENVIRONMENT, CONTENTFUL_SPACE } from '../../constants'
import { useContentTypeData } from '../../hooks/useContentTypeData'

const CONTENT_TYPES = ['price', 'supportQNA'] as const

type ContentType = typeof CONTENT_TYPES[number]
type Data = string[][]

const capitalize = (value: string) => {
  if (value?.length < 1) return ''
  return value[0].toUpperCase() + value.slice(1)
}

const isReferenceField = (field: { type: string }) => {
  return !(
    field.type === 'Symbol' ||
    field.type === 'Integer' ||
    field.type === 'RichText'
  )
}

interface ContentTypeSelectProps {
  selectedContentType: string | null
  setSelectedContentType: (value: ContentType) => void
}

const ContentTypeSelect = ({
  selectedContentType,
  setSelectedContentType,
}: ContentTypeSelectProps) => {
  return (
    <FormControl>
      <FormControl.Label>Content type</FormControl.Label>
      <Select
        id="content-type-select"
        name="content-type-select"
        value={selectedContentType}
        onChange={(ev) => {
          setSelectedContentType(ev.target.value as ContentType)
        }}
      >
        {CONTENT_TYPES.map((type) => (
          <Select.Option key={type} value={type}>
            {capitalize(type)}
          </Select.Option>
        ))}
      </Select>
    </FormControl>
  )
}

interface TagSelectProps {
  selectedTag: string | null
  setSelectedTag: (tag: string) => void
}

const TagSelect = ({ selectedTag, setSelectedTag }: TagSelectProps) => {
  const cma = useCMA()
  const [tagOptions, setTagOptions] = useState([])

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

  return (
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
  )
}

interface FileInputProps {
  setFileData: (fileData: Data) => void
}

const FileInput = ({ setFileData }: FileInputProps) => {
  const sdk = useSDK<PageExtensionSDK>()
  const [loading, setLoading] = useState(false)

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event?.target?.files?.[0]
    if (!file) {
      return
    }

    const reader = new FileReader()

    reader.onload = (e) => {
      const workbook = XLSX.read(e.target.result, { type: 'binary' })

      // In case there are multiple tabs in the excel file we ask which one to open
      if (workbook.SheetNames.length > 1) {
        sdk.dialogs
          .openPrompt({
            title: 'Select tab',
            message: 'Enter tab name',
          })
          .then((value) => {
            let sheet = workbook.Sheets[workbook.SheetNames[0]]

            if (
              typeof value === 'string' &&
              workbook.SheetNames.includes(value)
            ) {
              sheet = workbook.Sheets[value]
            }

            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 })
            setFileData(jsonData as Data)
            setLoading(false)
          })
      } else {
        const sheet = workbook.Sheets[workbook.SheetNames[0]]
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 })
        setFileData(jsonData as Data)
        setLoading(false)
      }
    }

    reader.onerror = () => {
      setLoading(false)
    }

    reader.readAsBinaryString(file)

    setLoading(true)
  }

  return (
    <Flex>
      <input type="file" accept=".xlsx" onChange={onFileChange} />
      {loading && <Spinner />}
    </Flex>
  )
}

interface FieldMappingProps {
  headCells: string[]
  contentTypeData: ContentTypeProps
  fieldMapping: { from: string; to: string | null }[]
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
            to: null,
          }
        }),
    )
  }, [contentTypeData, setFieldMapping])
  return (
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
  )
}

interface ReferenceFieldMappingProps {
  contentTypeData: ContentTypeProps
  referenceFieldMapping: { from: string; to: string | null }[]
  setReferenceFieldMapping: Dispatch<
    SetStateAction<FieldMappingProps['fieldMapping']>
  >
}

const ReferenceFieldMapping = ({
  contentTypeData,
  referenceFieldMapping,
  setReferenceFieldMapping,
}: ReferenceFieldMappingProps) => {
  console.log(contentTypeData)
  useEffect(() => {
    if (!contentTypeData) return
    setReferenceFieldMapping(
      contentTypeData.fields
        .filter((field) => isReferenceField(field))

        .map((field) => {
          return {
            from: field.name,
            to: null,
          }
        }),
    )
  }, [contentTypeData, setReferenceFieldMapping])
  return (
    <Stack flexDirection="column" spacing="spacingL">
      {referenceFieldMapping.map(({ from, to }, index) => {
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
              {['TODO'].map((text) => (
                <Select.Option key={text} value={text}>
                  {text}
                </Select.Option>
              ))}
            </Select>
          </Grid>
        )
      })}
    </Stack>
  )
}

const ContentImportScreen = () => {
  const sdk = useSDK<PageExtensionSDK>()
  const cma = useCMA()
  const [data, setData] = useState<Data>([])

  const [selectedContentType, setSelectedContentType] =
    useState<typeof CONTENT_TYPES[number]>('price')
  const contentTypeData = useContentTypeData(selectedContentType)
  const [selectedTag, setSelectedTag] = useState('')
  const [fieldMapping, setFieldMapping] = useState<
    { from: string; to: string | null }[]
  >([])
  const [referenceFieldMapping, setReferenceFieldMapping] = useState<
    { from: string; to: string | null }[]
  >([])

  const { headCells, bodyRows } = useMemo(() => {
    return {
      headCells: data?.[0] ?? [],
      bodyRows:
        data?.slice(1)?.filter((row) => row?.some((text) => text)) ?? [],
    }
  }, [data])

  return (
    <Box padding="spacingXl">
      <Stack
        spacing="spacing2Xl"
        flexDirection="column"
        alignItems="flex-start"
      >
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

        <Flex fullWidth justifyContent="space-between">
          <FileInput setFileData={setData} />
          <Button variant="primary" size="large">
            Import
          </Button>
        </Flex>

        <FieldMapping
          contentTypeData={contentTypeData}
          fieldMapping={fieldMapping}
          headCells={headCells}
          setFieldMapping={setFieldMapping}
        />

        <ReferenceFieldMapping
          contentTypeData={contentTypeData}
          referenceFieldMapping={referenceFieldMapping}
          setReferenceFieldMapping={setReferenceFieldMapping}
        />

        <Table>
          <Table.Head>
            <Table.Row>
              {headCells.map((text, index) => (
                <Table.Cell key={index}>{text}</Table.Cell>
              ))}
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {bodyRows.map((row, index) => (
              <Table.Row key={index}>
                {(row ?? []).map((text, index) => (
                  <Table.Cell key={index}>{text}</Table.Cell>
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
