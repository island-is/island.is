import React from 'react'
import { Box, Text, ActionCard, Stack } from '@island.is/island-ui/core'
import { useGetPetitionLists, useGetUserLists } from '../queries'
import { Link } from 'react-router-dom'
import { ServicePortalPath } from '@island.is/service-portal/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'

const Petitions = () => {
  const { formatMessage } = useLocale()
  const petitionLists = useGetPetitionLists() //all existing lists
  const userLists = useGetUserLists() //petitions that user has signed

  return (
    <Box marginBottom={[6, 6, 10]}>
      <Stack space={2}>
        <Text variant="h1" as="h1">
          {formatMessage(m.petition.introTitle)}
        </Text>

        <Text as="p" variant="intro">
          {formatMessage(m.petition.intro)}
        </Text>
      </Stack>

      <Box marginTop={10} marginBottom={7}>
        <Text as="p" variant="h3" marginBottom={2}>
          {formatMessage(m.petition.petitionListsIown)}
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
                    text={formatMessage(m.petition.listPeriod)}
                    cta={{
                      label: formatMessage(m.petition.editList),
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
          {formatMessage(m.petition.petitionListsSignedByMe)}
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
                    text={formatMessage(m.petition.listPeriod)}
                    cta={{
                      label: formatMessage(m.petition.viewList),
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
          {formatMessage(m.petition.closedListsSignedByMe)}
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
