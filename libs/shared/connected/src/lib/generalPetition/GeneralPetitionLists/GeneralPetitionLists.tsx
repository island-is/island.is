import React from 'react'
import { Box, Text, Stack, ActionCard } from '@island.is/island-ui/core'
import { useRouter } from 'next/router'
import { useGetPetitionLists } from './useGetPetitionLists'

export const GeneralPetitionLists = () => {
  const petitionLists = useGetPetitionLists()
  const router = useRouter()

  return (
    <>
      <Box marginBottom={3}>
        <Text variant="h4">{'Undirskriftalistar'}</Text>
      </Box>
      <Stack space={4}>
        {petitionLists.map((petition: any) => {
          console.log(petition)
          return (
            <ActionCard
              key={petition.title}
              backgroundColor="blue"
              heading={petition.title}
              text={petition.description}
              cta={{
                label: 'Nánar um lista',
                variant: 'text',
                icon: 'arrowForward',
                onClick: () =>
                  router.push(
                    '/undirskriftalistar/' + petition.meta.applicationId,
                  ),
              }}
            />
          )
        })}
      </Stack>
    </>
  )
}

export default GeneralPetitionLists
