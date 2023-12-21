import { useEffect, useState } from 'react'
import { FormControl, Select } from '@contentful/f36-components'
import { useCMA } from '@contentful/react-apps-toolkit'

import { CONTENTFUL_ENVIRONMENT, CONTENTFUL_SPACE } from '../../constants'

interface TagSelectProps {
  selectedTag: string | null
  setSelectedTag: (tag: string) => void
}

export const TagSelect = ({ selectedTag, setSelectedTag }: TagSelectProps) => {
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
          setSelectedTag(ev.target.value)
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
