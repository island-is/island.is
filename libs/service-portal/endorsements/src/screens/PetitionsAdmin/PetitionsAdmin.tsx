import React from 'react'
import { Box, Text, ActionCard, Stack } from '@island.is/island-ui/core'
import { useGetPetitionLists } from '../queries'
import { Link } from 'react-router-dom'
import { ServicePortalPath } from '@island.is/service-portal/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'

const PetitionsAdmin = () => {
  const { formatMessage } = useLocale()
  const petitionLists = useGetPetitionLists() //all existing lists

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
        {!!petitionLists.data && (
          <>
            <Text as="p" variant="h3" marginBottom={2}>
              {formatMessage(m.petition.petitionListsOngoing)}
            </Text>

            <Stack space={4}>
              {petitionLists.data.map((list: any) => {
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
                        label: formatMessage(m.petition.editList),
                        variant: 'text',
                        icon: 'arrowForward',
                      }}
                    />
                  </Link>
                )
              })}
            </Stack>
          </>
        )}

        {!!petitionLists.data && (
          <>
            <Text as="p" variant="h3" marginBottom={3} marginTop={7}>
              {formatMessage(m.petition.petitionListsClosed)}
            </Text>

            <Stack space={4}>
              {petitionLists.data.map((list: any) => {
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
                        label: formatMessage(m.petition.editList),
                        variant: 'text',
                        icon: 'arrowForward',
                      }}
                    />
                  </Link>
                )
              })}
            </Stack>
          </>
        )}
      </Box>
    </Box>
  )
}

export default PetitionsAdmin
