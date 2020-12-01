import React, { useState } from 'react'
import { Filter } from './Filter'
import { FilterMultiChoice } from './FilterMultiChoice/FilterMultiChoice'

export default {
  title: 'Components/Filter',
  component: Filter,
}

export const Default = () => {
  const [filter, setFilter] = useState<{
    price: Array<string>,
    data: Array<string>
  }>({
    price: [],
    data: []
  })

  return (
    <Filter clearBtnLabel="Hreinsa síu">
      <FilterMultiChoice categories={
        [
          {
            id: "pricing",
            label: "Kostnaður",
            selected: filter.price,
            filters: [
              {
                value: "free",
                label: "Gjaldfrjáls"
              },
              {
                value: "paid",
                label: "Gjaldskyld"
              }
            ] 
          },
          {
            id: "data",
            label: "Gögn",
            selected: filter.data,
            filters: [
              {
                value: "health",
                label: "Heilsa"
              },
              {
                value: "financial",
                label: "Fjármál"
              }
            ]
          }
        ]
      } 
      onChange={(data) => {
        setFilter({
          ...filter,
          [data.category]: data.selected
        })
      }}/>
    </Filter>
  )
}
