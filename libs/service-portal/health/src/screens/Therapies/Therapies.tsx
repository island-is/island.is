import React from 'react'
import { gql, useQuery } from '@apollo/client'
import { Query, Therapies as TherapiesType } from '@island.is/api/schema'
import { Box, SkeletonLoader, Tabs, TabType } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  EmptyState,
  ErrorScreen,
  IntroHeader,
  m,
} from '@island.is/service-portal/core'
import { messages } from '../../lib/messages'
import TherapiesTabContent from '../../components/TherapiesTabContent/TherapiesTabContent'

const GetTherapies = gql`
  query GetTherapies {
    getRightsPortalTherapies {
      id
      name
      periods {
        from
        to
        sessions {
          available
          used
        }
      }
      postStation
      state {
        code
        display
      }
    }
  }
`

const Therapies = () => {
  useNamespaces('sp.health')
  const { formatMessage } = useLocale()

  const { loading, error, data } = useQuery<Query>(GetTherapies)

  const therapiesData = data?.getRightsPortalTherapies ?? []

  const physicalTherapyData = therapiesData.filter(
    (x: TherapiesType) => x.id === 'physio',
  )
  const speechTherapyData = therapiesData.filter(
    (x: TherapiesType) => x.id === 'speech',
  )
  //TODO: Fá rétt ID fyrir Ljósböð
  const lightTherapyData = therapiesData.filter(
    (x: TherapiesType) => x.id === 'light',
  )
  //TODO: Fá rétt ID fyrir Iðjuþjálfun
  const occupationalTherapyData = therapiesData.filter(
    (x: TherapiesType) => x.id === 'occu',
  )

  if (error && !loading) {
    return (
      <ErrorScreen
        figure="./assets/images/hourglass.svg"
        tagVariant="red"
        tag={formatMessage(m.errorTitle)}
        title={formatMessage(m.somethingWrong)}
        children={formatMessage(m.errorFetchModule, {
          module: formatMessage(m.therapies).toLowerCase(),
        })}
      />
    )
  }

  const tabs = [
    physicalTherapyData.length > 0 && {
      label: formatMessage(messages.physicalTherapy),
      content: <TherapiesTabContent data={physicalTherapyData} />,
    },
    speechTherapyData.length > 0 && {
      label: formatMessage(messages.speechTherapy),
      content: <TherapiesTabContent data={speechTherapyData} />,
    },
    lightTherapyData.length > 0 && {
      label: formatMessage(messages.lightTherapy),
      content: <TherapiesTabContent data={lightTherapyData} />,
    },
    occupationalTherapyData.length > 0 && {
      label: formatMessage(messages.occupationalTherapy),
      content: <TherapiesTabContent data={occupationalTherapyData} />,
    },
  ].filter((x) => x !== false) as TabType[]

  return (
    <Box marginBottom={[6, 6, 10]}>
      <IntroHeader
        title={{
          id: 'sp.health:therapies-title',
          defaultMessage: 'Þjálfun',
        }}
        intro={{
          id: 'sp.health:therapies-intro',
          defaultMessage:
            'Sjúkratryggingar greiða hluta af kostnaði við meðferð hjá sjúkraþjálfara.',
        }}
      />
      {!loading && !error && tabs.length === 0 && (
        <Box marginTop={8}>
          <EmptyState />
        </Box>
      )}

      {!loading && !error && tabs.length > 0 && (
        <Box marginTop={[0, 0, 5]}>
          <Tabs
            label={formatMessage(messages.chooseTherapy)}
            tabs={tabs}
            contentBackground="transparent"
            selected="0"
            size="xs"
          />
        </Box>
      )}
    </Box>
  )
}

export default Therapies
