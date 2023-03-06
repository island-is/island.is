import React from 'react'
import { gql, useQuery } from '@apollo/client'
import { Query } from '@island.is/api/schema'
import { Box, SkeletonLoader } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { ErrorScreen, IntroHeader, m } from '@island.is/service-portal/core'

const GetTherapies = gql`
  query GetTherapies {
    getRightsPortalTherapies
  }
`

const Therapies = () => {
  useNamespaces('sp.health')
  const { formatMessage } = useLocale()

  const { loading, error, data } = useQuery<Query>(GetTherapies)

  console.log(data)

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

      <Box marginTop={2}>
        {loading && (
          <Box padding={3}>
            <SkeletonLoader space={1} height={40} repeat={5} />
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default Therapies
