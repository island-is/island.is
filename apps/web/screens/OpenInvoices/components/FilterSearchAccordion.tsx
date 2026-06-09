import { useState } from 'react'
import { useIntl } from 'react-intl'

import {
  Accordion,
  AccordionItem,
  Box,
  Checkbox,
  Icon,
  Inline,
  Input,
  Tag,
} from '@island.is/island-ui/core'

import { m } from '../messages'
import * as styles from './FilterSearchAccordion.css'

interface Props {
  id: string
  title: string
  items: Array<{ value: string; label: string }>
  selected: string[]
  onChange: (selected: string[]) => void
  showOptionsWhenEmpty?: boolean
  initiallyExpanded?: boolean
}

export const FilterSearchAccordion = ({
  id,
  title,
  items,
  selected,
  onChange,
  showOptionsWhenEmpty = true,
  initiallyExpanded = false,
}: Props) => {
  const { formatMessage } = useIntl()
  const [query, setQuery] = useState('')

  const filteredItems =
    query.length === 0 && !showOptionsWhenEmpty
      ? []
      : items.filter((item) =>
          item.label.toLowerCase().includes(query.toLowerCase()),
        )

  const toggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value))
    } else {
      onChange([...selected, value])
    }
  }

  const selectedItems = items.filter((item) => selected.includes(item.value))

  return (
    <Box paddingTop={1} paddingX={3}>
      <Accordion
        space={3}
        dividerOnBottom={false}
        dividerOnTop={false}
        singleExpand
      >
        <AccordionItem
          id={id}
          label={title}
          labelUse="h5"
          labelVariant="h5"
          iconVariant="small"
          startExpanded={initiallyExpanded}
        >
          <Box marginBottom={2}>
            <Input
              name={`${id}-search`}
              placeholder={formatMessage(m.search.filterSearch)}
              size="xs"
              backgroundColor="blue"
              value={query}
              icon={{ type: 'outline', name: 'search' }}
              onChange={(e) => setQuery(e.target.value)}
            />
          </Box>

          {selectedItems.length > 0 && (
            <Box marginTop={1} marginBottom={2} className={styles.tagList}>
              <Inline space={1}>
                {selectedItems.map((item) => (
                  <Tag
                    key={item.value}
                    variant="blue"
                    onClick={() => toggle(item.value)}
                  >
                    <Box
                      component="span"
                      display="flex"
                      alignItems="center"
                      columnGap={1}
                    >
                      <Box component="span" className={styles.tagLabel}>
                        {item.label}
                      </Box>
                      <Icon icon="close" size="small" color="blue400" />
                    </Box>
                  </Tag>
                ))}
              </Inline>
            </Box>
          )}

          <Box className={styles.scrollList} paddingX={1}>
            {filteredItems.map((item) => (
              <Checkbox
                key={item.value}
                name={`${id}-${item.value}`}
                label={item.label}
                checked={selected.includes(item.value)}
                onChange={() => toggle(item.value)}
              />
            ))}
          </Box>
        </AccordionItem>
      </Accordion>
    </Box>
  )
}
