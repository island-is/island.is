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

import { IntroHeader } from '@island.is/portals/core'
import { formatDate } from '../../shared/utils/utils'
import { PetitionPaths } from '../../lib/paths'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { EndorsementLists, FilteredPetitions } from '../../shared/utils/types'

const Overview = () => {
  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const { active, closed, locked } = useLoaderData() as FilteredPetitions

  const tabOption = (label: string, lists: EndorsementLists) => ({
    label,
    content: (
      <Box>
        <Box marginTop={6}>
          <Text variant="h4" marginBottom={2}>
            {label}
          </Text>
          <Stack space={3}>
            {lists.map((list: any) => {
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
      </Box>
    ),
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
            tabOption(formatMessage(m.openLists), active),
            tabOption(formatMessage(m.outdatedLists), closed),
            tabOption(formatMessage(m.lockedLists), locked),
          ]}
        />
      </Box>
    </GridContainer>
  )
}

export default Overview
