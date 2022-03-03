import React, { FC, useEffect } from 'react'
import { useHistory,useParams } from 'react-router-dom'
import { useMutation } from '@apollo/client'
import isEmpty from 'lodash/isEmpty'

import { coreMessages, getTypeFromSlug } from '@island.is/application/core'
import {
  APPLICATION_APPLICATIONS,
  CREATE_APPLICATION,
} from '@island.is/application/graphql'
import { ApplicationList } from '@island.is/application/ui-components'
import { ErrorShell } from '@island.is/application/ui-shell'
import {
  Box,
  Button,
  GridContainer,
  Page,
  Text,
} from '@island.is/island-ui/core'
import {
  useApplicationNamespaces,
  useLocale,
  useLocalizedQuery,
} from '@island.is/localization'

import { ApplicationLoading } from '../components/ApplicationsLoading/ApplicationLoading'

export const Applications: FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const history = useHistory()
  const { formatMessage } = useLocale()
  const type = getTypeFromSlug(slug)

  useApplicationNamespaces(type)

  const { data, loading, error: applicationsError } = useLocalizedQuery(
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
          typeId: type,
        },
      },
    })
  }

  useEffect(() => {
    if (type && data && isEmpty(data.applicationApplications)) {
      createApplication()
    }
  }, [type, data])

  if (loading) {
    return <ApplicationLoading />
  }

  if (!type || applicationsError) {
    return (
      <ErrorShell
        title={formatMessage(coreMessages.notFoundApplicationType)}
        subTitle={formatMessage(coreMessages.notFoundApplicationTypeMessage, {
          type,
        })}
      />
    )
  }

  if (createError) {
    return (
      <ErrorShell
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

            {data?.applicationApplications && (
              <ApplicationList
                applications={data.applicationApplications}
                onClick={(applicationUrl) =>
                  history.push(`../${applicationUrl}`)
                }
              />
            )}

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
