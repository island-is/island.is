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
  }>({
    price: [],
    data: [],
  })

  const [searchInput, setSearchInput] = useState('')

  return (
    <Box padding={2} background="blue100">
      <Filter
        labelClear="Hreinsa síu"
        onFilterClear={() => {
          setFilter({
            price: [],
            data: [],
          })

          setSearchInput('')
        }}
      >
        <FilterInput
          name="filter-input"
          placeholder="Sía eftir leitarorði"
          value={searchInput}
          onChange={(value) => {
            setSearchInput(value)
            console.log(`Search input changed ${searchInput}`)
          }}
        />

        <FilterMultiChoice
          labelClear="Hreinsa val"
          categories={[
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
          ]}
          onChange={(event) => {
            console.log(`On change`, event)
            setFilter({
              ...filter,
              [event.categoryId]: event.selected,
            })
          }}
          onClear={(categoryId) => {
            console.log(`Clear ${categoryId}`)
            setFilter({
              ...filter,
              [categoryId]: [],
            })
          }}
        />
      </Filter>
    </Box>
  )
}
