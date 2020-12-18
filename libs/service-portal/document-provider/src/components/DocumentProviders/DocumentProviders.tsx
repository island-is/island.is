import React, { FC, useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Box, Text, Input, ActionCard } from '@island.is/island-ui/core'
import { ServicePortalPath } from '@island.is/service-portal/core'

interface Data {
  name: string
  id: string
}

interface Props {
  data: Array<Data>
}

export const DocumentProvidersSearch: FC<Props> = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState(data)
  const handleChange = (value: string) => {
    setSearchTerm(value)
  }

  useEffect(() => {
    const results = data.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setSearchResults(results)
  }, [searchTerm, data])

  const history = useHistory()
  return (
    <Box>
      <Input
        placeholder="Leitaðu af skjalaveitanda"
        name="searchProviders"
        backgroundColor="blue"
        icon="search"
        value={searchTerm}
        onChange={(e) => {
          handleChange(e.target.value)
        }}
      />
      {searchResults && (
        <Box marginY={3}>
          <Box marginBottom={2}>
            <Text variant="h3" as="h3">
              {searchResults.length} Skjalaveitendur fundust
            </Text>
          </Box>
          {searchResults.map((Data, index) => (
            <Box marginBottom={2} key={index}>
              <ActionCard
                heading={Data.name}
                cta={{
                  label: 'Skoða nánar',
                  variant: 'secondary',
                  onClick: () => {
                    history.push(
                      ServicePortalPath.DocumentProviderDocumentProvidersSingle.replace(
                        ':id',
                        Data.id,
                      ),
                    )
                  },
                }}
              />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  )
}
