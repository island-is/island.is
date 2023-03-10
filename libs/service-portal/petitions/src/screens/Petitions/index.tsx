import {
  Box,
  Button,
  GridColumn,
  Stack,
  Tabs,
  Text,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { ServicePortalPath } from '@island.is/service-portal/core'
import { IntroHeader } from '@island.is/portals/core'
import { m } from '../../lib/messages'
import {
  PaginatedEndorsementListResponse as OwnedLists,
  PaginatedEndorsementResponse as SignedLists,
} from '../../types/schema'
import { useGetListsUserSigned, useListsUserOwns } from '../hooks'
import { ActionCard } from '@island.is/service-portal/core'
import { formatDate } from '../../lib/utils'

const Petitions = () => {
  useNamespaces('sp.petitions')
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
    <>
      <IntroHeader
        title={formatMessage(m.title)}
        intro={formatMessage(m.intro)}
      >
        <GridColumn span={['8/8', '3/8']}>
          <Box
            display={'flex'}
            justifyContent={['flexStart', 'flexEnd']}
            paddingTop={[2]}
          >
            <Button
              onClick={() =>
                window.open(
                  `${document.location.origin}/umsoknir/undirskriftalisti/`,
                )
              }
              size="small"
            >
              {formatMessage(m.createList)}
            </Button>
          </Box>
        </GridColumn>
      </IntroHeader>
      <Box>
        <Tabs
          contentBackground="white"
          label={formatMessage(m.title)}
          selected="0"
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
                            <ActionCard
                              key={list.id}
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
                                url: ServicePortalPath.PetitionListOwned.replace(
                                  ':listId',
                                  list.id,
                                ),
                              }}
                            />
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
                            <ActionCard
                              key={list.id}
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
                                url: ServicePortalPath.PetitionList.replace(
                                  ':listId',
                                  list.endorsementList?.id,
                                ),
                              }}
                            />
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
                            <ActionCard
                              key={list.id}
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
                                url: ServicePortalPath.PetitionListOwned.replace(
                                  ':listId',
                                  list.id,
                                ),
                              }}
                            />
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
                            <ActionCard
                              key={list.id}
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
                                url: ServicePortalPath.PetitionList.replace(
                                  ':listId',
                                  list.endorsementList?.id,
                                ),
                              }}
                            />
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
    </>
  )
}

export default Petitions
