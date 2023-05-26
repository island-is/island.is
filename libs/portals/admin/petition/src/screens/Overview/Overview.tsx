import { ActionCard, Box, Stack, Tabs } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'

import { IntroHeader } from '@island.is/portals/core'
import { formatDate } from '../../shared/utils/utils'
import { PetitionPaths } from '../../lib/paths'
import { useLoaderData, useNavigate, useRevalidator } from 'react-router-dom'
import { EndorsementLists, FilteredPetitions } from '../../shared/utils/types'
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
                  label: formatMessage(m.viewLists),
                  variant: 'text',
                  icon: 'arrowForward',
                  onClick: () => {
                    navigate(
                      PetitionPaths.PetitionsSingle.replace(':listId', list.id),
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
        title={formatMessage(m.title)}
        intro={formatMessage(m.overview)}
      />
      <Box marginTop={8}>
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
    </>
  )
}

export default Overview
