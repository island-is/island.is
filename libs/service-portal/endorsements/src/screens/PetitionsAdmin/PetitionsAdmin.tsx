import React from 'react'
import { Box, Text, ActionCard, Stack } from '@island.is/island-ui/core'
import { useGetPetitionLists } from '../queries'
import { Link } from 'react-router-dom'
import { ServicePortalPath } from '@island.is/service-portal/core'

const PetitionsAdmin = () => {
  const petitionLists = useGetPetitionLists() //all existing lists

  return (
    <Box marginBottom={[6, 6, 10]}>
      <Stack space={2}>
        <Text variant="h1" as="h1">
          {'Meðmæli'}
        </Text>

        <Text as="p" variant="intro">
          {'Yfirlit yfir meðmæli og meðmælendalista í þinni umsjá'}
        </Text>
      </Stack>

      <Box marginTop={4}>
        <Text as="p" variant="h3" marginBottom={3} marginTop={7}>
          {'Virkir listar'}
        </Text>

        {!!petitionLists.length && (
          <Stack space={4}>
            {petitionLists.map((list) => {
              return (
                <Link
                  style={{ textDecoration: 'none' }}
                  key={list.id}
                  to={{
                    pathname: ServicePortalPath.PetitionListAdmin.replace(
                      ':listId',
                      list.id,
                    ),
                    state: { type: 'unendorse', listId: list.id },
                  }}
                >
                  <ActionCard
                    backgroundColor="white"
                    heading={list.title}
                    text={list.description as string}
                    cta={{
                      label: 'Sýsla með lista',
                      variant: 'text',
                      icon: 'arrowForward',
                    }}
                  />
                </Link>
              )
            })}
          </Stack>
        )}

        <Text as="p" variant="h3" marginBottom={3} marginTop={7}>
          {'Lokaðir listar'}
        </Text>

        {!!petitionLists.length && (
          <Stack space={4}>
            {petitionLists.map((list) => {
              return (
                <Link
                  style={{ textDecoration: 'none' }}
                  key={list.id}
                  to={{
                    pathname: ServicePortalPath.PetitionListAdmin.replace(
                      ':listId',
                      list.id,
                    ),
                    state: { type: 'unendorse', listId: list.id },
                  }}
                >
                  <ActionCard
                    backgroundColor="red"
                    heading={list.title}
                    text={list.description as string}
                    cta={{
                      label: 'Sýsla með lista',
                      variant: 'text',
                      icon: 'arrowForward',
                    }}
                  />
                </Link>
              )
            })}
          </Stack>
        )}
      </Box>
    </Box>
  )
}

export default PetitionsAdmin
