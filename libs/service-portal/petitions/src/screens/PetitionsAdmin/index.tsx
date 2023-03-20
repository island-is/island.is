import format from 'date-fns/format'
import { Link } from 'react-router-dom'

import { Box, Stack, Text } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { IntroHeader, ServicePortalPath } from '@island.is/service-portal/core'
import { ActionCard } from '@island.is/service-portal/core'

import { m } from '../../lib/messages'
import { PaginatedEndorsementListResponse } from '../../types/schema'
import { useGetAllPetitionLists } from '../hooks'

const formatDate = (date: string) => {
  try {
    return format(new Date(date), 'dd.MM.yyyy')
  } catch {
    return date
  }
}

const PetitionsAdmin = () => {
  useNamespaces('sp.petitions')
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
      <IntroHeader title={m.title} intro={m.intro} />

      <Box marginTop={5} marginBottom={7}>
        {openLists && openLists.length > 0 && (
          <>
            <Text as="p" variant="h4" marginBottom={2}>
              {'//Todo: add texts after moving this screen to admin system'}
            </Text>

            <Stack space={4}>
              {openLists.map((list: any) => {
                return (
                  <Link
                    style={{ textDecoration: 'none' }}
                    key={list.id}
                    state={{ listId: list.id }}
                    to={ServicePortalPath.PetitionListAdmin.replace(
                      ':listId',
                      list.id,
                    )}
                  >
                    <ActionCard
                      backgroundColor="white"
                      heading={list.title}
                      text={
                        formatMessage(m.listPeriod) +
                        ' ' +
                        formatDate(list.openedDate) +
                        ' - ' +
                        formatDate(list.closedDate)
                      }
                      cta={{
                        label: formatMessage(m.editList),
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
              {'//Todo: add texts after moving this screen to admin system'}
            </Text>

            <Stack space={4}>
              {closedLists.map((list: any) => {
                return (
                  <Link
                    style={{ textDecoration: 'none' }}
                    key={list.id}
                    state={{ listId: list.id }}
                    to={ServicePortalPath.PetitionListAdmin.replace(
                      ':listId',
                      list.id,
                    )}
                  >
                    <ActionCard
                      backgroundColor="blue"
                      heading={list.title}
                      text={
                        formatMessage(m.listPeriod) +
                        ' ' +
                        formatDate(list.openedDate) +
                        ' - ' +
                        formatDate(list.closedDate)
                      }
                      cta={{
                        label: formatMessage(m.editList),
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
              {'//Todo: add texts after moving this screen to admin system'}
            </Text>

            <Stack space={4}>
              {lockedLists.map((list: any) => {
                return (
                  <Link
                    style={{ textDecoration: 'none' }}
                    key={list.id}
                    state={{ listId: list.id }}
                    to={ServicePortalPath.PetitionListAdmin.replace(
                      ':listId',
                      list.id,
                    )}
                  >
                    <ActionCard
                      backgroundColor="red"
                      heading={list.title}
                      text={
                        formatMessage(m.listPeriod) +
                        ' ' +
                        formatDate(list.openedDate) +
                        ' - ' +
                        formatDate(list.closedDate)
                      }
                      cta={{
                        label: formatMessage(m.editList),
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
