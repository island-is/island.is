import { Link } from 'react-router-dom'
import { Box, Stack, Tabs, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { IntroHeader, ServicePortalPath } from '@island.is/service-portal/core'
import { m } from '../../lib/messages'
import {
  PaginatedEndorsementListResponse,
  PaginatedEndorsementResponse,
} from '../../types/schema'
import { useGetListsUserSigned, useListsUserOwns } from '../queries'
import { ActionCard } from '@island.is/service-portal/core'
import { formatDate } from '../../lib/utils'

const Petitions = () => {
  const { formatMessage } = useLocale()

  const getPetitionListsUserOwns = useListsUserOwns()
  const getPetitionListsUserSigned = useGetListsUserSigned()

  const ownedLists = (getPetitionListsUserOwns as PaginatedEndorsementListResponse)
    .data
  const signedLists = (getPetitionListsUserSigned as PaginatedEndorsementResponse)
    .data

  //Closed lists
  const closedSignedLists = signedLists?.filter((list) => {
    return new Date() >= new Date(list.endorsementList?.closedDate)
  })
  const closedOwnedLists = ownedLists?.filter((list) => {
    return new Date() >= new Date(list?.closedDate)
  })

  //Open lists
  const openSignedLists = signedLists?.filter((list) => {
    return (
      new Date(list.endorsementList?.openedDate) <= new Date() &&
      new Date() <= new Date(list.endorsementList?.closedDate)
    )
  })
  const openOwnedLists = ownedLists?.filter((list) => {
    return (
      new Date(list.openedDate) <= new Date() &&
      new Date() <= new Date(list?.closedDate)
    )
  })

  return (
    <Box marginBottom={[6, 6, 10]}>
      <IntroHeader
        title={formatMessage(m.title)}
        intro={formatMessage(m.intro)}
      />

      <Box marginTop={5}>
        <Tabs
          contentBackground="white"
          label={'Tabs'}
          selected={'openLists'}
          tabs={[
            {
              id: 'openLists',
              label: formatMessage(m.openLists),
              content: (
                <Box>
                  <Box marginTop={8}>
                    <Text variant="h4" marginBottom={2}>
                      {formatMessage(m.myLists)}
                    </Text>
                    {openOwnedLists && openOwnedLists.length > 0 && (
                      <Stack space={3}>
                        {openOwnedLists.map((list: any) => {
                          return (
                            <Link
                              style={{ textDecoration: 'none' }}
                              key={list.id}
                              state={{ type: 'edit', listId: list.id }}
                              to={ServicePortalPath.PetitionList.replace(
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
                    )}
                  </Box>
                  <Box marginTop={8}>
                    <Text variant="h4" marginBottom={2}>
                      {formatMessage(m.signedLists)}
                    </Text>
                    {openSignedLists && openSignedLists.length > 0 && (
                      <Stack space={4}>
                        {openSignedLists.map((list: any) => {
                          return (
                            <Link
                              style={{ textDecoration: 'none' }}
                              key={list.id}
                              state={{
                                listId: list.endorsementList?.id,
                              }}
                              to={ServicePortalPath.PetitionList.replace(
                                ':listId',
                                list.id,
                              )}
                            >
                              <ActionCard
                                backgroundColor="white"
                                heading={list.endorsementList?.title}
                                text={
                                  formatMessage(m.listPeriod) +
                                  ' ' +
                                  formatDate(list.endorsementList.openedDate) +
                                  ' - ' +
                                  formatDate(list.endorsementList.closedDate)
                                }
                                cta={{
                                  label: formatMessage(m.viewList),
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
              ),
            },
            {
              id: 'outdatedLists',
              label: formatMessage(m.outdatedLists),
              content: (
                <Box>
                  <Box marginTop={8}>
                    <Text variant="h4" marginBottom={2}>
                      {formatMessage(m.myLists)}
                    </Text>
                    {closedOwnedLists && closedOwnedLists.length > 0 && (
                      <Stack space={3}>
                        {closedOwnedLists.map((list: any) => {
                          return (
                            <Link
                              style={{ textDecoration: 'none' }}
                              key={list.id}
                              state={{ type: 'edit', listId: list.id }}
                              to={ServicePortalPath.PetitionList.replace(
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
                    )}
                  </Box>
                  <Box marginTop={8}>
                    <Text variant="h4" marginBottom={2}>
                      {formatMessage(m.signedLists)}
                    </Text>
                    {closedSignedLists && closedSignedLists.length > 0 && (
                      <Stack space={4}>
                        {closedSignedLists.map((list: any) => {
                          return (
                            <Link
                              style={{ textDecoration: 'none' }}
                              key={list.id}
                              state={{
                                listId: list.endorsementList?.id,
                              }}
                              to={ServicePortalPath.PetitionList.replace(
                                ':listId',
                                list.id,
                              )}
                            >
                              <ActionCard
                                backgroundColor="white"
                                heading={list.endorsementList?.title}
                                text={
                                  formatMessage(m.listPeriod) +
                                  ' ' +
                                  formatDate(list.endorsementList.openedDate) +
                                  ' - ' +
                                  formatDate(list.endorsementList.closedDate)
                                }
                                cta={{
                                  label: formatMessage(m.viewList),
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
              ),
            },
          ]}
        />
      </Box>
    </Box>
  )
}

export default Petitions
