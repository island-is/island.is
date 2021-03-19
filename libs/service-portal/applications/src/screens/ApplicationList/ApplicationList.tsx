import React from 'react'
import format from 'date-fns/format'
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
  ActionCard,
} from '@island.is/island-ui/core'
import { useApplications } from '@island.is/service-portal/graphql'
import { Application } from '@island.is/application/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import * as Sentry from '@sentry/react'
import { useHistory } from 'react-router-dom'

import { m } from '../../lib/messages'

const isDev = window.location.origin.includes('beta.dev01.devland.is')
const isStaging = window.location.origin.includes('beta.staging01.devland.is')
const isProduction = window.location.origin.includes('https://island.is')

const baseUrlForm = isDev
  ? 'https://umsoknir.dev01.devland.is'
  : isStaging
  ? 'https://umsoknir.staging01.devland.is'
  : isProduction
  ? 'https://umsoknir.island.is'
  : 'http://localhost:4242'

const ApplicationList: ServicePortalModuleComponent = () => {
  useNamespaces('sp.applications')
  Sentry.configureScope((scope) => scope.setTransactionName('Applications'))

  const { formatMessage, lang } = useLocale()
  const { data: applications, loading, error } = useApplications()
  const history = useHistory()
  const dateFormat = lang === 'is' ? 'dd.MM.yyyy' : 'MM/dd/yyyy'

  return (
    <>
      <Box marginBottom={5}>
        <GridRow>
          <GridColumn>
            <Stack space={2}>
              <Text variant="h1" as="h1">
                {formatMessage(m.heading)}
              </Text>

              <Text as="p" variant="intro">
                {formatMessage(m.introCopy)}
              </Text>
            </Stack>
          </GridColumn>
        </GridRow>
      </Box>

      {loading && <ActionCardLoader repeat={3} />}

      {error && (
        <Box display="flex" justifyContent="center" margin={[3, 3, 3, 6]}>
          <Text variant="h3" as="h3">
            {formatMessage(m.error)}
          </Text>
        </Box>
      )}

      <Stack space={2}>
        {applications.map((application: Application) => {
          const isComplete = application.progress === 1

          return (
            <ActionCard
              key={application.id}
              date={format(new Date(application.modified), dateFormat)}
              heading={application.name || application.typeId}
              tag={{
                label: isComplete
                  ? formatMessage(m.cardStatusDone)
                  : formatMessage(m.cardStatusInProgress),
                variant: isComplete ? 'mint' : 'blue',
                outlined: false,
              }}
              cta={{
                label: isComplete
                  ? formatMessage(m.cardButtonComplete)
                  : formatMessage(m.cardButtonInProgress),
                variant: 'ghost',
                size: 'small',
                icon: undefined,
                onClick: () =>
                  history.replace(`${baseUrlForm}/umsokn/${application.id}`),
              }}
              text={
                isComplete
                  ? formatMessage(m.cardStatusCopyDone)
                  : formatMessage(m.cardStatusCopyDone)
              }
              progressMeter={{
                active: !isComplete,
                progress: application.progress ? application.progress : 0,
                variant: isComplete ? 'mint' : 'blue',
              }}
            />
          )
        })}
      </Stack>
    </>
  )
}

export default ApplicationList
