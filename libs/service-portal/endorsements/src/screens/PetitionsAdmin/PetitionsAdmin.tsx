import format from 'date-fns/format'
import React from 'react'
import { Link } from 'react-router-dom'

import { Box, Bullet, BulletList, Stack, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { IntroHeader, ServicePortalPath } from '@island.is/service-portal/core'
import { ActionCard } from '@island.is/service-portal/core'

import { m } from '../../lib/messages'
import { PaginatedEndorsementListResponse } from '../../types/schema'
import { useGetAllPetitionLists } from '../queries'

const formatDate = (date: string) => {
  try {
    return format(new Date(date), 'dd.MM.yyyy')
  } catch {
    return date
  }
}

const PetitionsAdmin = () => {
  const { formatMessage } = useLocale()
  const getAllPetitionLists = useGetAllPetitionLists()
  const allPetitionLists = (getAllPetitionLists as PaginatedEndorsementListResponse)
    .data

  const openLists = allPetitionLists?.filter((list) => {
    return (
      new Date(list.openedDate) <= new Date() &&
      new Date() <= new Date(list.closedDate) &&
      !list.adminLock
    )
  })

  const closedLists = allPetitionLists?.filter((list) => {
    return new Date() >= new Date(list.closedDate) && !list.adminLock
  })

  const lockedLists = allPetitionLists?.filter((list) => {
    return list.adminLock === true
  })

  return (
    <Box marginBottom={[6, 6, 10]}>
      <IntroHeader title={m.petition.introTitle} intro={m.petition.intro} />

      <Box padding="gutter">
        <BulletList type="ul">
          <Bullet>{formatMessage(m.petition.bullet1Admin)}</Bullet>
          <Bullet>{formatMessage(m.petition.bullet2Admin)}</Bullet>
          <Bullet>{formatMessage(m.petition.bullet3Admin)}</Bullet>
        </BulletList>
      </Box>

      <Box marginTop={5} marginBottom={7}>
        {openLists && openLists.length > 0 && (
          <>
            <Text as="p" variant="h4" marginBottom={2}>
              {formatMessage(m.petition.petitionListsOngoing)}
            </Text>

            <Stack space={4}>
              {openLists.map((list: any) => {
                return (
                  <Link
                    style={{ textDecoration: 'none' }}
                    key={list.id}
                    to={{
                      pathname: ServicePortalPath.PetitionListAdmin.replace(
                        ':listId',
                        list.id,
                      ),
                      state: { listId: list.id },
                    }}
                  >
                    <ActionCard
                      backgroundColor="white"
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

        {closedLists && closedLists.length > 0 && (
          <>
            <Text as="p" variant="h4" marginBottom={3} marginTop={7}>
              {formatMessage(m.petition.petitionListsClosed)}
            </Text>

            <Stack space={4}>
              {closedLists.map((list: any) => {
                return (
                  <Link
                    style={{ textDecoration: 'none' }}
                    key={list.id}
                    to={{
                      pathname: ServicePortalPath.PetitionListAdmin.replace(
                        ':listId',
                        list.id,
                      ),
                      state: { listId: list.id },
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

        {lockedLists && lockedLists.length > 0 && (
          <>
            <Text as="p" variant="h4" marginBottom={3} marginTop={7}>
              {formatMessage(m.petition.petitionListsLocked)}
            </Text>

            <Stack space={4}>
              {lockedLists.map((list: any) => {
                return (
                  <Link
                    style={{ textDecoration: 'none' }}
                    key={list.id}
                    to={{
                      pathname: ServicePortalPath.PetitionListAdmin.replace(
                        ':listId',
                        list.id,
                      ),
                      state: { listId: list.id },
                    }}
                  >
                    <ActionCard
                      backgroundColor="red"
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
    </Box>
  )
}

export default PetitionsAdmin
