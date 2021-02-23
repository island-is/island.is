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
} from '@island.is/island-ui/core'
import { useApplications } from '@island.is/service-portal/graphql'
import { Application } from '@island.is/application/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import * as Sentry from '@sentry/react'

import ApplicationCard from '../../components/ApplicationCard/ApplicationCard'
import { m } from '../../lib/messages'
import { environment } from '../../environments'

const ApplicationList: ServicePortalModuleComponent = () => {
  useNamespaces('sp.applications')
  Sentry.configureScope((scope) => scope.setTransactionName('Applications'))

  const { formatMessage, lang } = useLocale()
  const { data: applications, loading, error } = useApplications()
  const dateFormat = lang === 'is' ? 'dd.MM.yyyy' : 'MM/dd/yyyy'

  return (
    <>
      <Box marginBottom={5}>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '6/8', '6/8']}>
            <Stack space={2}>
              <Text variant="h1" as="h1">
                {formatMessage(m.name)}
              </Text>

              <Text as="p" variant="intro">
                {formatMessage(m.introText)}
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

      {/* TODO add translations */}
      <Stack space={2}>
        {(applications ?? []).map((application: Application) => (
          <ApplicationCard
            key={application.id}
            name={application.name || application.typeId}
            date={format(new Date(application.modified), dateFormat)}
            isApplicant={application.isApplicant}
            isAssignee={application.isAssignee}
            isComplete={application.progress === 1}
            url={`${environment.applicationSystem.baseFormUrl}/umsoknir/${application.id}`}
            progress={application.progress ? application.progress * 100 : 0}
          />
        ))}
      </Stack>
    </>
  )
}

export default ApplicationList
