import React, { FC, useEffect } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { useParams, useHistory } from 'react-router-dom'
import format from 'date-fns/format'
import isEmpty from 'lodash/isEmpty'
import {
  CREATE_APPLICATION,
  APPLICANT_APPLICATIONS,
} from '@island.is/application/graphql'
import {
  Text,
  Box,
  Stack,
  ActionCard,
  Page,
  Button,
} from '@island.is/island-ui/core'
import { Application, m } from '@island.is/application/core'
import { NotFound } from '@island.is/application/ui-shell'
import { useLocale } from '@island.is/localization'

import useAuth from '../hooks/useAuth'

export const Applications: FC = () => {
  const { type } = useParams()
  const history = useHistory()
  const { userInfo } = useAuth()
  const { formatMessage } = useLocale()
  const nationalRegistryId = userInfo?.profile?.nationalId

  const { data, loading, error: applicationsError } = useQuery(
    APPLICANT_APPLICATIONS,
    {
      variables: {
        typeId: type,
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
        },
      },
    })
  }

  useEffect(() => {
    if (data && isEmpty(data.getApplicationsByApplicant)) {
      createApplication()
    }
  }, [data])

  if (applicationsError)
    return (
      <NotFound
        title={formatMessage(m.notFoundApplicationType)}
        subTitle={formatMessage(m.notFoundApplicationTypeMessage, { type })}
      />
    )

  if (createError)
    return (
      <NotFound
        title={formatMessage(m.createErrorApplication)}
        subTitle={formatMessage(m.createErrorApplicationMessage, { type })}
      />
    )

  return (
    <Page>
      {!loading && !isEmpty(data?.getApplicationsByApplicant) && (
        <Box padding="containerGutter">
          <Box marginTop={5} marginBottom={5}>
            <Text variant="h1">{formatMessage(m.applications)}</Text>
          </Box>

          <Stack space={2}>
            {data?.getApplicationsByApplicant?.map(
              (application: Application) => (
                <ActionCard
                  key={application.id}
                  heading={application.name || application.typeId}
                  text={format(new Date(application.modified), 'do MMMM yyyy')}
                  cta={{
                    label: formatMessage(m.buttonNext),
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
              {formatMessage(m.newApplication)}
            </Button>
          </Box>
        </Box>
      )}
    </Page>
  )
}
