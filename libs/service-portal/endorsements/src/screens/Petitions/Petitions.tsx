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

        {!!petitionLists.data && (
          <Stack space={4}>
            {petitionLists.data.map((pl: any) => {
              return (
                <Link
                  style={{ textDecoration: 'none' }}
                  key={pl.id}
                  to={{
                    pathname: ServicePortalPath.PetitionList.replace(
                      ':listId',
                      pl.id,
                    ),
                    state: { type: 'edit', listId: pl.id },
                  }}
                >
                  <ActionCard
                    backgroundColor="blue"
                    heading={pl.title}
                    text={'Tímabil lista: '}
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

      <Box marginTop={4}>
        <Text as="p" variant="h3" marginBottom={2}>
          {'Virkir listar sem ég hef mælt með'}
        </Text>

        {!!userLists.data && (
          <Stack space={4}>
            {userLists.data.map((list: any) => {
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
                    text={'Tímabil lista: '}
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

      {/*<Box marginTop={4}>
        <Text as="p" variant="h3" marginBottom={2}>
          {'Lokaðir listar sem ég hef mælt með'}
        </Text>

        {!!userLists.length && (
          <Stack space={4}>
            {userLists.map((list: any) => {
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
                    backgroundColor="red"
                    heading={list.endorsementList?.title}
                    text={'Tímabil lista: '}
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
      </Box>*/}
    </Box>
  )
}

export default Petitions
