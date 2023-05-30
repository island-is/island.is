import React from 'react'
import { useLocale, useNamespaces } from '@island.is/localization'
import { useGetWorkMachinesQuery } from './WorkMachinesOverview.generated'
import {
  m,
  ErrorScreen,
  EmptyState,
  CardLoader,
} from '@island.is/service-portal/core'
import { IntroHeader } from '@island.is/portals/core'
import { ActionCard, Box } from '@island.is/island-ui/core'
import { messages } from '../../lib/messages'

const WorkMachinesOverview = () => {
  useNamespaces('sp.vehicles')
  const { formatMessage } = useLocale()

  const { loading, error, data } = useGetWorkMachinesQuery()

  console.log(error)

  if (error && !loading) {
    return (
      <ErrorScreen
        figure="./assets/images/hourglass.svg"
        tagVariant="red"
        tag={formatMessage(m.errorTitle)}
        title={formatMessage(m.somethingWrong)}
        children={formatMessage(m.errorFetchModule, {
          module: formatMessage(m.workMachines).toLowerCase(),
        })}
      />
    )
  }

  return (
    <Box marginBottom={[6, 6, 10]}>
      <IntroHeader
        title={formatMessage(messages.workMachinesTitle)}
        intro={formatMessage(messages.workMachinesDescription)}
      />
      {loading && (
        <Box marginBottom={2}>
          <CardLoader />
        </Box>
      )}

      {!loading && !data?.workMachines && (
        <Box width="full" marginTop={4} display="flex" justifyContent="center">
          <Box marginTop={8}>
            <EmptyState />
          </Box>
        </Box>
      )}

      {!loading &&
        !error &&
        data?.workMachines?.value &&
        data.workMachines.value.map((wm, index) => {
          return (
            <Box marginBottom={3} key={index}>
              <ActionCard
                text={'A.B.G. Puma'}
                heading={'Tæki Tæki Tæki'}
                cta={{
                  label: formatMessage(m.seeDetails),
                  variant: 'text',
                }}
                tag={{ label: 'í notkun' }}
              />
            </Box>
          )
        })}
    </Box>
  )
}

export default WorkMachinesOverview
