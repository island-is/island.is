import React from 'react'
import { Box, Text, Stack, ActionCard } from '@island.is/island-ui/core'
import { useRouter } from 'next/router'
import { generalPetitions } from '../mocks'

export const GeneralPetitionLists = () => {
  const router = useRouter()

  return (
    <>
      <Box marginBottom={3}>
        <Text variant="h4">{'Undirskriftalistar'}</Text>
      </Box>
      <Stack space={4}>
        {generalPetitions.map((petition) => {
          return (
            <ActionCard
              key={petition.title}
              backgroundColor="blue"
              heading={petition.title}
              text={
                'Fjöldi undirskrifta: ' +
                petition.signedPetitions?.length +
                ' Virkur til: ' +
                petition.til
              }
              cta={{
                label: 'Nánar um lista',
                variant: 'text',
                icon: 'arrowForward',
                onClick: () =>
                  router.push('/undirskriftalistar/' + petition.listId),
              }}
            />
          )
        })}
      </Stack>
    </>
  )
}

export default GeneralPetitionLists
