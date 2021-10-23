import React from 'react'
import { Box, Text, ActionCard, Stack } from '@island.is/island-ui/core'
import { useGetListsUserSigned, useListsUserOwns } from '../queries'
import { Link } from 'react-router-dom'
import { ServicePortalPath } from '@island.is/service-portal/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import format from 'date-fns/format'
import {
  PaginatedEndorsementResponse,
  PaginatedEndorsementListResponse,
} from '../../types/schema'

const formatDate = (date: string) => {
  try {
    return format(new Date(date), 'dd.MM.yyyy')
  } catch {
    return date
  }
}

const Petitions = () => {
  const { formatMessage } = useLocale()
  const getPetitionListsUserOwns = useListsUserOwns()
  const getPetitionListsUserSigned = useGetListsUserSigned()

  const ownedLists = (getPetitionListsUserOwns as PaginatedEndorsementListResponse)
    .data
  const signedLists = (getPetitionListsUserSigned as PaginatedEndorsementResponse)
    .data

  //finding signed lists that are open and signed lists that are closed
  const openSignedLists = signedLists?.filter((list) => {
    return (
      new Date(list.endorsementList?.openedDate) <= new Date() &&
      new Date() <= new Date(list.endorsementList?.closedDate)
    )
  })

  const closedSignedLists = signedLists?.filter((list) => {
    return new Date() >= new Date(list.endorsementList?.closedDate)
  })

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
        {ownedLists && ownedLists.length > 0 && (
          <>
            <Text as="p" variant="h3" marginBottom={2}>
              {formatMessage(m.petition.petitionListsIown)}
            </Text>
            <Stack space={4}>
              {ownedLists.map((list: any) => {
                return (
                  <Link
                    style={{ textDecoration: 'none' }}
                    key={list.id}
                    to={{
                      pathname: ServicePortalPath.PetitionList.replace(
                        ':listId',
                        list.id,
                      ),
                      state: { type: 'edit', listId: list.id },
                    }}
                  >
                    <ActionCard
                      backgroundColor="blue"
                      heading={list.title}
                      text={
                        formatMessage(m.petition.listPeriod) +
                        ' ' +
                        formatDate(list.openedDate) +
                        ' - ' +
                        formatDate(list.closedDate)
                      }
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

      <Box marginTop={4}>
        {openSignedLists && openSignedLists.length > 0 && (
          <>
            <Text as="p" variant="h3" marginBottom={2}>
              {formatMessage(m.petition.petitionListsSignedByMe)}
            </Text>
            <Stack space={4}>
              {openSignedLists.map((list: any) => {
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
                        listId: list.endorsementList?.id,
                      },
                    }}
                  >
                    <ActionCard
                      backgroundColor="white"
                      heading={list.endorsementList?.title}
                      text={
                        formatMessage(m.petition.listPeriod) +
                        ' ' +
                        formatDate(list.endorsementList.openedDate) +
                        ' - ' +
                        formatDate(list.endorsementList.closedDate)
                      }
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
          </>
        )}
      </Box>

      <Box marginTop={4}>
        {closedSignedLists && closedSignedLists.length > 0 && (
          <>
            <Text as="p" variant="h3" marginBottom={2}>
              {formatMessage(m.petition.closedListsSignedByMe)}
            </Text>
            <Stack space={4}>
              {closedSignedLists.map((list: any) => {
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
                        listId: list.endorsementList?.id,
                      },
                    }}
                  >
                    <ActionCard
                      backgroundColor="red"
                      heading={list.endorsementList?.title}
                      text={
                        formatMessage(m.petition.listPeriod) +
                        ' ' +
                        formatDate(list.endorsementList.openedDate) +
                        ' - ' +
                        formatDate(list.endorsementList.closedDate)
                      }
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
          </>
        )}
      </Box>
    </Box>
  )
}

export default Petitions
