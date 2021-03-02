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
  Button,
  Link,
  Divider,
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
          <GridColumn>
            <Stack space={2}>
              <Text variant="h1" as="h1">
                {formatMessage(m.heading)}
              </Text>

              <Text as="p" variant="intro">
                {formatMessage(m.introCopy)}
              </Text>

              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                justifyContent="spaceBetween"
                background="blue100"
                padding={4}
                marginTop={1}
                borderRadius="large"
                width="full"
              >
                <Box marginRight={2}>
                  <Text variant="h3" color="blue600">
                    {formatMessage(m.introBlock)}
                  </Text>
                </Box>

                <Link href="https://island.is/flokkur/fjolskylda-og-velferd">
                  <Button icon="open" iconType="outline" nowrap>
                    {formatMessage(m.introButton)}
                  </Button>
                </Link>
              </Box>

              <Box marginTop={4}>
                <Divider />
              </Box>

              <GridRow>
                <GridColumn span="8/12">
                  <Text as="p" marginTop={3}>
                    {formatMessage(m.listCopy)}
                  </Text>
                </GridColumn>
              </GridRow>
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
