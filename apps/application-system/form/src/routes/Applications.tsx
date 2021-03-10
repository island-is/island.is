import React, { FC, useEffect } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { useParams, useHistory } from 'react-router-dom'
import format from 'date-fns/format'
import isEmpty from 'lodash/isEmpty'
import {
  CREATE_APPLICATION,
  APPLICATION_APPLICATIONS,
} from '@island.is/application/graphql'
import {
  Text,
  Box,
  Stack,
  ActionCard,
  Page,
  Button,
} from '@island.is/island-ui/core'
import {
  Application,
  ApplicationStatus,
  ApplicationTypes,
  coreMessages,
} from '@island.is/application/core'
import { NotFound } from '@island.is/application/ui-shell'
import { useLocale } from '@island.is/localization'

import useAuth from '../hooks/useAuth'

export const Applications: FC = () => {
  const { type } = useParams<{ type: ApplicationTypes }>()
  const history = useHistory()
  const { userInfo } = useAuth()
  const { formatMessage } = useLocale()
  const nationalRegistryId = userInfo?.profile?.nationalId

  const { data, loading, error: applicationsError } = useQuery(
    APPLICATION_APPLICATIONS,
    {
      variables: {
        input: { typeId: type },
      },
    },
  )

  const [createApplicationMutation, { error: createError }] = useMutation(
    CREATE_APPLICATION,
    {
      onCompleted({ createApplication }) {
        history.push(`../umsokn/${createApplication.id}`)
      },
    },
  )

  function createApplication() {
    createApplicationMutation({
      variables: {
        input: {
          applicant: nationalRegistryId,
          state: 'draft',
          attachments: {},
          typeId: type,
          assignees: [nationalRegistryId],
          answers: {},
          status: ApplicationStatus.IN_PROGRESS,
        },
      },
    })
  }

  useEffect(() => {
    if (data && isEmpty(data.applicationApplications)) {
      createApplication()
    }
  }, [data])

  if (applicationsError)
    return (
      <NotFound
        title={formatMessage(coreMessages.notFoundApplicationType)}
        subTitle={formatMessage(coreMessages.notFoundApplicationTypeMessage, {
          type,
        })}
      />
    )

  if (createError)
    return (
      <NotFound
        title={formatMessage(coreMessages.createErrorApplication)}
        subTitle={formatMessage(coreMessages.createErrorApplicationMessage, {
          type,
        })}
      />
    )

  return (
    <Page>
      {!loading && !isEmpty(data?.applicationApplications) && (
        <Box padding="containerGutter">
          <Box marginTop={5} marginBottom={5}>
            <Text variant="h1">{formatMessage(coreMessages.applications)}</Text>
          </Box>

          <Stack space={2}>
            {(data?.applicationApplications ?? []).map(
              (application: Application) => (
                <ActionCard
                  key={application.id}
                  heading={application.name || application.typeId}
                  text={format(new Date(application.modified), 'do MMMM yyyy')}
                  cta={{
                    label: formatMessage(coreMessages.buttonNext),
                    variant: 'secondary',
                    onClick: () => history.push(`../umsokn/${application.id}`),
                  }}
                  progressMeter={{
                    active: true,
                    progress: application.progress,
                  }}
                />
              ),
            )}
          </Stack>
          <Box
            marginTop={5}
            marginBottom={5}
            display="flex"
            justifyContent="flexEnd"
          >
            <Button onClick={createApplication}>
              {formatMessage(coreMessages.newApplication)}
            </Button>
          </Box>
        </Box>
      )}
    </Page>
  )
}
