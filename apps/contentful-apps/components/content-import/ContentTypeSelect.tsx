import { FormControl, Select } from '@contentful/f36-components'

const CONTENT_TYPES = ['price', 'supportQNA'] as const
export type ContentType = typeof CONTENT_TYPES[number]

const capitalize = (value: string) => {
  if (value?.length < 1) return ''
  return value[0].toUpperCase() + value.slice(1)
}

interface ContentTypeSelectProps {
  selectedContentType: string | null
  setSelectedContentType: (value: ContentType) => void
}

export const ContentTypeSelect = ({
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
