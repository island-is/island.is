import React from 'react'
import { Box, Text, ActionCard, Stack } from '@island.is/island-ui/core'
import { useGetPetitionLists } from './useGetPetitionLists'

const Petitions = () => {
  const petitionLists = useGetPetitionLists()
  return (
    <Box marginBottom={[6, 6, 10]}>
      <Stack space={2}>
        <Text variant="h1" as="h1">
          {'Undirskriftalistar'}
        </Text>

        <Text as="p" variant="intro">
          {'texti hér'}
        </Text>
      </Stack>

      {!!petitionLists.length && (
        <Box marginTop={4}>
          <Stack space={4}>
            {petitionLists.map((list) => {
              return (
                <ActionCard
                  key={list.id}
                  backgroundColor="blue"
                  heading={list.title}
                  text={list.description as string}
                  cta={{
                    label: 'Skoða lista',
                    variant: 'text',
                    icon: 'arrowForward',
                  }}
                />
              )
            })}
          </Stack>
        </Box>
      )}
    </Box>
  )
}

export default Petitions
