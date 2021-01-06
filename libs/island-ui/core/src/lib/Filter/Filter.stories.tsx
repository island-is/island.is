import React, { useState } from 'react'
import { Box } from '../Box/Box'
import { Filter } from './Filter'
import { FilterMultiChoice } from './FilterMultiChoice/FilterMultiChoice'
import { FilterInput } from './FilterInput/FilterInput'

export default {
  title: 'Components/Filter',
  component: Filter,
}

export const Default = () => {
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

  return (
    <>
      <Box padding={2} background="blue100" display={['none', 'none', 'block']}>
        <Filter
          labelClear="Hreinsa síu"
          labelOpen="Opna síu"
          labelClose="Loka síu"
          labelTitle="Sía API Vörulista"
          labelResult="Sýna niðurstöður"
          resultCount={64}
          onFilterClear={() =>
            setFilter({
              price: [],
              data: [],
              input: '',
            })
          }
        >
          <FilterInput
            name="filter-input"
            placeholder="Sía eftir leitarorði"
            value={filter.input}
            onChange={(value) => setFilter({ ...filter, input: value })}
          />

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
      </Box>
      <Box
        padding={2}
        background="blue100"
        display={['block', 'block', 'none']}
      >
        <Filter
          labelClear="Hreinsa síu"
          labelOpen="Opna síu"
          labelClose="Loka síu"
          labelTitle="Sía API Vörulista"
          labelResult="Sýna niðurstöður"
          resultCount={64}
          isDialog
          onFilterClear={() =>
            setFilter({
              price: [],
              data: [],
              input: '',
            })
          }
        >
          <FilterInput
            name="filter-input"
            placeholder="Sía eftir leitarorði"
            value={filter.input}
            onChange={(value) => setFilter({ ...filter, input: value })}
          />

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
      </Box>
    </>
  )
}
