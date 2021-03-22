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
  GridContainer,
} from '@island.is/island-ui/core'
import {
  Application,
  ApplicationStatus,
  coreMessages,
  getTypeFromSlug,
} from '@island.is/application/core'
import { NotFound } from '@island.is/application/ui-shell'
import { useApplicationNamespaces, useLocale } from '@island.is/localization'
import { dateFormat } from '@island.is/shared/constants'

import useAuth from '../hooks/useAuth'

export const Applications: FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const history = useHistory()
  const { userInfo } = useAuth()
  const { formatMessage } = useLocale()
  const nationalRegistryId = userInfo?.profile?.nationalId
  const type = getTypeFromSlug(slug)

  useApplicationNamespaces(type)

  const { data, loading, error: applicationsError } = useQuery(
    APPLICATION_APPLICATIONS,
    {
      variables: {
        input: { typeId: type },
      },
      skip: !type,
    },
  )

  const [createApplicationMutation, { error: createError }] = useMutation(
    CREATE_APPLICATION,
    {
      onCompleted({ createApplication }) {
        history.push(`../${slug}/${createApplication.id}`)
      },
    },
  )

  const createApplication = () => {
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
    if (type && data && isEmpty(data.applicationApplications)) {
      createApplication()
    }
  }, [type, data])

  if (!type || applicationsError) {
    return (
      <NotFound
        title={formatMessage(coreMessages.notFoundApplicationType)}
        subTitle={formatMessage(coreMessages.notFoundApplicationTypeMessage, {
          type,
        })}
      />
    )
  }

  if (createError) {
    return (
      <NotFound
        title={formatMessage(coreMessages.createErrorApplication)}
        subTitle={formatMessage(coreMessages.createErrorApplicationMessage, {
          type,
        })}
      />
    )
  }

  return (
    <Page>
      <GridContainer>
        {!loading && !isEmpty(data?.applicationApplications) && (
          <Box>
            <Box marginTop={5} marginBottom={5}>
              <Text variant="h1">
                {formatMessage(coreMessages.applications)}
              </Text>
            </Box>

            <Stack space={2}>
              {(data?.applicationApplications ?? []).map(
                (application: Application) => {
                  const isComplete =
                    application.status === ApplicationStatus.COMPLETED

                  return (
                    <ActionCard
                      key={application.id}
                      date={format(
                        new Date(application.modified),
                        dateFormat.is,
                      )}
                      tag={{
                        label: isComplete
                          ? formatMessage(coreMessages.tagsInCompleted)
                          : formatMessage(coreMessages.tagsInProgress),
                        variant: isComplete ? 'mint' : 'blue',
                        outlined: false,
                      }}
                      heading={application.name || application.typeId}
                      text={application.applicant}
                      cta={{
                        label: formatMessage(coreMessages.buttonNext),
                        variant: 'ghost',
                        size: 'small',
                        icon: undefined,
                        onClick: () =>
                          history.push(`../${slug}/${application.id}`),
                      }}
                      progressMeter={{
                        active: true,
                        progress: application.progress,
                        variant: isComplete ? 'mint' : 'blue',
                      }}
                    />
                  )
                },
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
      </GridContainer>
    </Page>
  )
}
