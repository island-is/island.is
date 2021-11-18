import React from 'react'
import {
  ActionCardLoader,
  ServicePortalModuleComponent,
} from '@island.is/service-portal/core'
import {
  Text,
  Box,
  Stack,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'
import { useApplications } from '@island.is/service-portal/graphql'
import { ApplicationList as List } from '@island.is/application/ui-components'
import { useLocale, useNamespaces } from '@island.is/localization'
import * as Sentry from '@sentry/react'

import { m } from '../../lib/messages'

const isLocalhost = window.location.origin.includes('localhost')
const isDev = window.location.origin.includes('beta.dev01.devland.is')
const isStaging = window.location.origin.includes('beta.staging01.devland.is')

const baseUrlForm = isLocalhost
  ? 'http://localhost:4242/umsoknir'
  : isDev
  ? 'https://beta.dev01.devland.is/umsoknir'
  : isStaging
  ? 'https://beta.staging01.devland.is/umsoknir'
  : 'https://island.is/umsoknir'

const ApplicationList: ServicePortalModuleComponent = () => {
  useNamespaces('sp.applications')
  useNamespaces('application.system')

  Sentry.configureScope((scope) => scope.setTransactionName('Applications'))

  const { formatMessage } = useLocale()
  const { data: applications, loading, error } = useApplications()

  return (
    <>
      <Box marginBottom={5}>
        <GridRow>
          <GridColumn>
            <Stack space={2}>
              <Text variant="h3" as="h1">
                {formatMessage(m.heading)}
              </Text>

              <Text as="p" variant="default">
                {formatMessage(m.introCopy)}
              </Text>
            </Stack>
          </GridColumn>
        </GridRow>
      </Box>

      {loading && <ActionCardLoader repeat={3} />}

      {error && (
        <Box display="flex" justifyContent="center" margin={[3, 3, 3, 6]}>
          <Text variant="h4" as="h3">
            {formatMessage(m.error)}
          </Text>
        </Box>
      )}

      {applications && (
        <List
          applications={applications}
          onClick={(applicationUrl) =>
            window.open(`${baseUrlForm}/${applicationUrl}`)
          }
        />
      )}
    </>
  )
}

export default ApplicationList
