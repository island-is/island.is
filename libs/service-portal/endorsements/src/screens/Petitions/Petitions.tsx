import React from 'react'
import { Box, Text, ActionCard, Stack } from '@island.is/island-ui/core'
import { useGetPetitionLists, useGetUserLists } from '../queries'
import { Link } from 'react-router-dom'
import { ServicePortalPath } from '@island.is/service-portal/core'

const Petitions = () => {
  const petitionLists = useGetPetitionLists() //all existing lists
  const userLists = useGetUserLists() //petitions that user has signed

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

      <Box marginTop={10} marginBottom={7}>
        <Text as="p" variant="h3" marginBottom={2}>
          {'Listar stofnaðir af mér'}
        </Text>

        {!!petitionLists.length && (
          <Stack space={4}>
            <Link
              style={{ textDecoration: 'none' }}
              key={petitionLists[0].id}
              to={{
                pathname: ServicePortalPath.PetitionList.replace(
                  ':listId',
                  petitionLists[0].id,
                ),
                state: { type: 'edit', listId: petitionLists[0].id },
              }}
            >
              <ActionCard
                backgroundColor="blue"
                heading={petitionLists[0].title}
                text={petitionLists[0].description as string}
                cta={{
                  label: 'Sýsla með lista',
                  variant: 'text',
                  icon: 'arrowForward',
                }}
              />
            </Link>
          </Stack>
        )}
      </Box>

      <Box marginTop={4}>
        <Text as="p" variant="h3" marginBottom={2}>
          {'Virkir listar sem ég hef mælt með'}
        </Text>

        {!!userLists.length && (
          <Stack space={4}>
            {userLists.map((list) => {
              return (
                <Link
                  style={{ textDecoration: 'none' }}
                  key={list.id}
                  to={{
                    pathname: ServicePortalPath.PetitionList.replace(
                      ':listId',
                      list.id,
                    ),
                    state: {
                      type: 'unendorse',
                      listId: list.endorsementList?.id,
                    },
                  }}
                >
                  <ActionCard
                    backgroundColor="white"
                    heading={list.endorsementList?.title}
                    text={list.endorsementList?.description as string}
                    cta={{
                      label: 'Skoða nánar',
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
          {'Fleiri listar ;)'}
        </Text>

        {!!petitionLists.length && (
          <Stack space={4}>
            {petitionLists.map((list) => {
              return (
                <Link
                  style={{ textDecoration: 'none' }}
                  key={list.id}
                  to={{
                    pathname: ServicePortalPath.PetitionList.replace(
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
                      label: 'Skoða nánar',
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

export default Petitions
