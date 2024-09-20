import React, { useState } from 'react'

import { FilterInput, Text } from '@island.is/island-ui/core'
import { OneColumnText, Slice } from '@island.is/web/graphql/schema'

interface SliceProps {
  slices: Array<OneColumnText>
}

export const SliceFilter = ({ slices }: SliceProps) => {
  const [searchValue, setSearchValue] = useState<string | null>()

  return (
    <>
      <FilterInput
        name="one-col-list-search"
        onChange={(value) => {
          setSearchValue(value || null)
        }}
        value={searchValue ?? ''}
        placeholder={'search here my guy'}
        backgroundColor="white"
      />
      {slices.map((s, i) => {
        const secondLevel = s.content?.map((c, j) => {
          return <Text key={`${i}-${j}`}>{c.title}</Text>
        })
        return <Text key={i}>{s.title}</Text>
      })}
    </>
  )
}
