import { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { Box, Button, Inline, Select, Tag } from '@island.is/island-ui/core'
import { Fish } from '@island.is/web/graphql/schema'
import { GET_ALL_FISHES_QUERY } from './queries'

import * as styles from './FishSelect.css'

const emptyValue = { value: -1, label: '' }

type GetAllFishesQuery = {
  getAllFishes: Fish[]
}

export const FishSelect = () => {
  const { data } = useQuery<GetAllFishesQuery>(GET_ALL_FISHES_QUERY)

  const [optionsInDropdown, setOptionsInDropdown] = useState([])

  const [selectedOptions, setSelectedOptions] = useState([])

  useEffect(() => {
    if (!data?.getAllFishes) return
    const fishes = data.getAllFishes
      .filter((fish) => fish?.name)
      .map((fish) => ({
        value: fish.id,
        label: fish.name,
      }))
    if (selectedOptions.length === 0) {
      fishes.sort((a, b) => a.label.localeCompare(b.label))
      setOptionsInDropdown(fishes)
    }
  }, [data])

  return (
    <Box>
      <Box className={styles.selectBox} marginBottom={3}>
        <Select
          size="sm"
          label="Bæta við tegund"
          name="tegund-fiskur-select"
          options={optionsInDropdown}
          onChange={(selectedOption: { value: number; label: string }) => {
            setSelectedOptions((prev) => prev.concat(selectedOption))
            setOptionsInDropdown((prev) => {
              return prev.filter((o) => o.value !== selectedOption.value)
            })
          }}
          value={emptyValue}
        />
      </Box>
      <Inline alignY="center" space={2}>
        {selectedOptions.map((o) => (
          <Tag
            onClick={() => {
              setSelectedOptions((prevSelected) =>
                prevSelected.filter((prev) => prev.value !== o.value),
              )
              setOptionsInDropdown((prevDropdown) => {
                const updatedDropdown = prevDropdown.concat(o)
                updatedDropdown.sort((a, b) => a.label.localeCompare(b.label))
                return updatedDropdown
              })
            }}
            key={o.value}
          >
            <Box flexDirection="row" alignItems="center">
              {o.label}
              <span className={styles.crossmark}>&#10005;</span>
            </Box>
          </Tag>
        ))}
        {selectedOptions.length > 0 && (
          <Button
            onClick={() => {
              setSelectedOptions((prevSelected) => {
                setOptionsInDropdown((prevDropdown) => {
                  const updatedDropdown = prevDropdown.concat(prevSelected)
                  updatedDropdown.sort((a, b) => a.label.localeCompare(b.label))
                  return updatedDropdown
                })
                return []
              })
            }}
            variant="text"
            size="small"
            colorScheme="default"
          >
            Hreinsa allt
          </Button>
        )}
      </Inline>
    </Box>
  )
}
