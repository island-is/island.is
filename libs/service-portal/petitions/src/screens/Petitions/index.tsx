import { Link } from 'react-router-dom'
import { Box, Stack, Tabs, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { IntroHeader, ServicePortalPath } from '@island.is/service-portal/core'
import { m } from '../../lib/messages'
import {
  PaginatedEndorsementListResponse as OwnedLists,
  PaginatedEndorsementResponse as SignedLists,
} from '../../types/schema'
import { useGetListsUserSigned, useListsUserOwns } from '../hooks'
import { ActionCard } from '@island.is/service-portal/core'
import { formatDate } from '../../lib/utils'

const Petitions = () => {
  const { formatMessage } = useLocale()
  const ownedLists = useListsUserOwns()
  const signedLists = useGetListsUserSigned()

  //Open lists
  const openSignedLists = (signedLists as SignedLists)?.data?.filter((list) => {
    return (
      new Date(list.endorsementList?.openedDate) <= new Date() &&
      new Date() <= new Date(list.endorsementList?.closedDate)
    )
  })
  const openOwnedLists = (ownedLists as OwnedLists)?.data?.filter((list) => {
    return (
      new Date(list.openedDate) <= new Date() &&
      new Date() <= new Date(list?.closedDate)
    )
  })

  //Closed lists
  const closedSignedLists = (signedLists as SignedLists)?.data?.filter(
    (list) => {
      return new Date() >= new Date(list.endorsementList?.closedDate)
    },
  )
  const closedOwnedLists = (ownedLists as OwnedLists)?.data?.filter((list) => {
    return new Date() >= new Date(list?.closedDate)
  })

  return (
    <Box>
      <IntroHeader
        title={formatMessage(m.title)}
        intro={formatMessage(m.intro)}
      />

      <Box>
        <Tabs
          contentBackground="white"
          label="petitionListsTabs"
          selected='0'
          tabs={[
            {
              label: formatMessage(m.openLists),
              content: (
                <Box>
                  {openOwnedLists && openOwnedLists.length > 0 && (
                    <Box marginTop={6}>
                      <Text variant="h4" marginBottom={2}>
                        {formatMessage(m.myLists)}
                      </Text>
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
                    </Box>
                  )}

                  {openSignedLists && openSignedLists.length > 0 && (
                    <Box marginTop={6}>
                      <Text variant="h4" marginBottom={2}>
                        {formatMessage(m.signedLists)}
                      </Text>
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
                    </Box>
                  )}
                </Box>
              ),
            },
            {
              label: formatMessage(m.outdatedLists),
              content: (
                <Box>
                  {closedOwnedLists && closedOwnedLists.length > 0 && (
                    <Box marginTop={6}>
                      <Text variant="h4" marginBottom={2}>
                        {formatMessage(m.myLists)}
                      </Text>
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
                    </Box>
                  )}

                  {closedSignedLists && closedSignedLists.length > 0 && (
                    <Box marginTop={6}>
                      <Text variant="h4" marginBottom={2}>
                        {formatMessage(m.signedLists)}
                      </Text>
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
                    </Box>
                  )}
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
