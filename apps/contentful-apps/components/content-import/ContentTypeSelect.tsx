import { FormControl, Select } from '@contentful/f36-components'

interface ContentTypeSelectProps {
  selectedContentType: string | null
  setSelectedContentType: (value: string) => void
  contentTypes: { label: string; value: string }[]
  disabled?: boolean
}

export const ContentTypeSelect = ({
  selectedContentType,
  setSelectedContentType,
  contentTypes,
  disabled = false,
}: ContentTypeSelectProps) => {
  return (
    <FormControl>
      <FormControl.Label>Content type</FormControl.Label>
      <Select
        id="content-type-select"
        name="content-type-select"
        value={selectedContentType}
        onChange={(ev) => {
          setSelectedContentType(ev.target.value)
        }}
        isDisabled={disabled}
      >
        {contentTypes.map((type) => (
          <Select.Option key={type.value} value={type.value}>
            {type.label}
          </Select.Option>
        ))}
      </Select>
    </FormControl>
  )
}
