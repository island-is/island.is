import { AsyncSearch, Box, Input, Stack } from '@island.is/island-ui/core'
import React, { useState } from 'react'

const Search: React.FC = () => {
  const [query, setQuery] = useState('')

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setQuery(event.target.value)
  }

  const handleSearch = () => {
    // Implement search logic here
    console.log('Searching for:', query)
  }

  return (
    <Box>
      <Stack space={8}>
        <Input
          label="Leit"
          name="search"
          size="sm"
          placeholder="Leitaðu á mínum síðum"
          onChange={(e) => handleInputChange(e)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              handleSearch()
            }
          }}
          buttons={[
            {
              name: 'search',
              type: 'outline',
              label: 'Leita',
              onClick: handleSearch,
            },
          ]}
        />

        <AsyncSearch options={[{ label: 'Label 1', value: 'Value 1' }]} />
      </Stack>
    </Box>
  )
}

export default Search
