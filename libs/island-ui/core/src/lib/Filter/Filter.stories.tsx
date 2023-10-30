import React, { useEffect, useState } from 'react'
import { useWindowSize } from 'react-use'

import { theme } from '@island.is/island-ui/theme'

import { Box } from '../Box/Box'
import { Text } from '../Text/Text'
import { Filter, FilterProps } from './Filter'
import { FilterMultiChoice } from './FilterMultiChoice/FilterMultiChoice'
import { FilterInput } from './FilterInput/FilterInput'

export default {
  title: 'Components/Filter',
  component: Filter,
}

const RenderVariant = (variant: FilterProps['variant'], inputButton?: boolean) => {
  const [isMobile, setIsMobile] = useState(false)
  const { width } = useWindowSize()
  useEffect(() => {
    if (width < theme.breakpoints.md) {
      return setIsMobile(true)
    }
    setIsMobile(false)
  }, [width])
  const [filter, setFilter] = useState<{
    price: Array<string>
    data: Array<string>
    input: string
  }>({
    price: [],
    data: [],
    input: '',
  })

  const categories = [
    {
      id: 'price',
      label: 'Kostnaður',
      selected: filter.price,
      filters: [
        {
          value: 'free',
          label: 'Gjaldfrjáls',
        },
        {
          value: 'paid',
          label: 'Gjaldskyld',
        },
      ],
    },
    {
      id: 'data',
      label: 'Gögn',
      selected: filter.data,
      filters: [
        {
          value: 'health',
          label: 'Heilsa',
        },
        {
          value: 'financial',
          label: 'Fjármál',
        },
      ],
    },
  ]

  const renderDefaultFilter = (asDialog?: boolean, inputButton?: boolean) => (
    <Filter
      labelClearAll="Hreinsa allar síur"
      labelClear="Hreinsa síu"
      labelOpen="Opna síu"
      labelClose="Loka síu"
      labelTitle="Sía API Vörulista"
      labelResult="Sýna niðurstöður"
      resultCount={64}
      variant={asDialog ? 'dialog' : variant}
      onFilterClear={() =>
        setFilter({
          price: [],
          data: [],
          input: '',
        })
      }
      filterInput={
        <FilterInput
          name="filter-input"
          placeholder="Sía eftir leitarorði"
          value={filter.input}
          onChange={(value) => setFilter({ ...filter, input: value })}
          button={inputButton ? {
            label: 'Search',
            onClick: () => undefined
          } : undefined}
        />
      }
    >
      <FilterMultiChoice
        labelClear="Hreinsa val"
        categories={categories}
        onChange={(event) =>
          setFilter({
            ...filter,
            [event.categoryId]: event.selected,
          })
        }
        onClear={(categoryId) =>
          setFilter({
            ...filter,
            [categoryId]: [],
          })
        }
      />
    </Filter>
  )

  return (
    <Box padding={2} background="blue100">
      {renderDefaultFilter(isMobile, inputButton)}
    </Box>
  )
}

export const Default = () => (
  <>
    <Box marginBottom={4}>{RenderVariant('default')}</Box>
    <Box padding={2} background="blue100">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur
      suscipit non, facilis vero architecto accusantium cupiditate odit dolore
      repellendus ab ex, dicta debitis explicabo culpa rerum reprehenderit atque
      reiciendis fuga!
    </Box>
  </>
)

export const InputButton = () => (
  <>
    <Box marginBottom={4}>{RenderVariant('default', true)}</Box>
    <Box padding={2} background="blue100">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur
      suscipit non, facilis vero architecto accusantium cupiditate odit dolore
      repellendus ab ex, dicta debitis explicabo culpa rerum reprehenderit atque
      reiciendis fuga!
    </Box>
  </>
)

export const Popover = () => (
  <Box style={{ height: 800 }}>
    {RenderVariant('popover')}
    <Box paddingX={2} paddingBottom={2} background="blue100">
      <Text>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur
        suscipit non, facilis vero architecto accusantium cupiditate odit dolore
        repellendus ab ex, dicta debitis explicabo culpa rerum reprehenderit
        atque reiciendis fuga!
      </Text>
    </Box>
    <Box paddingX={2} paddingBottom={2} background="blue100">
      <Text>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur
        suscipit non, facilis vero architecto accusantium cupiditate odit dolore
        repellendus ab ex, dicta debitis explicabo culpa rerum reprehenderit
        atque reiciendis fuga!
      </Text>
    </Box>
  </Box>
)
