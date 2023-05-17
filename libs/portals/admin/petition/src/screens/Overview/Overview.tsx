import {
  ActionCard,
  Box,
  Button,
  GridColumn,
  GridContainer,
  Stack,
  Tabs,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { EndorsementListControllerFindByTagsTagsEnum } from '@island.is/api/schema'
import {
  EndorsementSystemFindEndorsementListsQuery,
  useEndorsementSystemFindEndorsementListsQuery,
} from '../../shared/queries/getAllEndorsementsLists.generated'
import { IntroHeader } from '@island.is/portals/core'
import { formatDate } from '../../shared/utils/utils'
import { PetitionPaths } from '../../lib/paths'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { EndorsementLists } from '../../shared/utils/types'

const Overview = () => {
  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const [allLists, setAllLists] = useState<EndorsementLists>()

  const {
    data,
    loading: queryLoading,
    error,
  } = useEndorsementSystemFindEndorsementListsQuery({
    variables: {
      input: {
        tags: [EndorsementListControllerFindByTagsTagsEnum.generalPetition],
        limit: 1000,
      },
    },
    onCompleted: ({
      endorsementSystemFindEndorsementLists,
    }: EndorsementSystemFindEndorsementListsQuery) => {
      console.log(endorsementSystemFindEndorsementLists.data)
      setAllLists(endorsementSystemFindEndorsementLists)
    },
  })

  const openLists = allLists?.data.filter((list) => {
    return (
      new Date(list.openedDate) <= new Date() &&
      new Date() <= new Date(list.closedDate) &&
      !list.adminLock
    )
  })

  const closedLists = allLists?.data.filter((list) => {
    return new Date() >= new Date(list.closedDate) && !list.adminLock
  })

  const lockedLists = allLists?.data.filter((list) => {
    return list.adminLock === true
  })
  return (
    <GridContainer>
      <IntroHeader
        title={formatMessage(m.title)}
        intro={formatMessage(m.overview)}
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
              {formatMessage(m.overview)}
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
                  {openLists && openLists.length > 0 && (
                    <Box marginTop={6}>
                      <Text variant="h4" marginBottom={2}>
                        {formatMessage(m.openLists)}
                      </Text>
                      <Stack space={3}>
                        {openLists.map((list: any) => {
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
                                label: formatMessage(m.viewLists),
                                variant: 'text',
                                icon: 'arrowForward',
                                onClick: () => {
                                  navigate(
                                    PetitionPaths.PetitionsSingle.replace(
                                      ':listId',
                                      list.id,
                                    ),
                                    {
                                      state: {
                                        list,
                                      },
                                    },
                                  )
                                },
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
                  {closedLists && closedLists.length > 0 && (
                    <Box marginTop={6}>
                      <Text variant="h4" marginBottom={2}>
                        {formatMessage(m.outdatedLists)}
                      </Text>
                      <Stack space={3}>
                        {closedLists.map((list: any) => {
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
                                label: formatMessage(m.viewLists),
                                variant: 'text',
                                icon: 'arrowForward',
                                onClick: () => {
                                  navigate(
                                    PetitionPaths.PetitionsSingle.replace(
                                      ':listId',
                                      list.id,
                                    ),
                                    {
                                      state: {
                                        list,
                                      },
                                    },
                                  )
                                },
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
                  {lockedLists && lockedLists.length > 0 && (
                    <Box marginTop={6}>
                      <Text variant="h4" marginBottom={2}>
                        {formatMessage(m.lockedLists)}
                      </Text>
                      <Stack space={3}>
                        {lockedLists.map((list: any) => {
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
                                label: formatMessage(m.viewLists),
                                variant: 'text',
                                icon: 'arrowForward',
                                onClick: () => {
                                  navigate(
                                    PetitionPaths.PetitionsSingle.replace(
                                      ':listId',
                                      list.id,
                                    ),
                                    {
                                      state: {
                                        list,
                                      },
                                    },
                                  )
                                },
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
    </GridContainer>
  )
}

export default Overview
