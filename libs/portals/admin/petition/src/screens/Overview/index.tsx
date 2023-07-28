import { ActionCard, Box, Stack, Tabs } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'

import { IntroHeader } from '@island.is/portals/core'
import { formatDate } from '../../lib/utils/utils'
import { PetitionPaths } from '../../lib/paths'
import { useLoaderData, useNavigate, useRevalidator } from 'react-router-dom'
import { EndorsementLists, FilteredPetitions } from '../../lib/utils/types'
import { useEffect } from 'react'

const Overview = () => {
  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const { active, closed, locked } = useLoaderData() as FilteredPetitions
  const { revalidate } = useRevalidator()

  useEffect(() => {
    revalidate()
  }, [])

  const tabOption = (label: string, lists: EndorsementLists) => ({
    label,
    content: (
      <Box marginTop={6}>
        <Stack space={3}>
          {lists.map((list: any) => {
            return (
              <ActionCard
                key={list.id}
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
                  label: formatMessage(m.viewList),
                  variant: 'text',
                  icon: 'arrowForward',
                  onClick: () => {
                    navigate(
                      PetitionPaths.PetitionList.replace(':listId', list.id),
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
    ),
  })

  return (
    <>
      <IntroHeader
        title={formatMessage(m.petitionsTitle)}
        intro={formatMessage(m.intro)}
      />
      <Box marginTop={8}>
        <Tabs
          contentBackground="white"
          label={formatMessage(m.petitionsTitle)}
          tabs={[
            tabOption(formatMessage(m.openLists), active),
            tabOption(formatMessage(m.outdatedLists), closed),
            tabOption(formatMessage(m.lockedLists), locked),
          ]}
        />
      </Box>
    </>
  )
}

export default Overview
