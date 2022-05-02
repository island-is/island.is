import React, { FC, useCallback, useEffect, useState } from 'react'
import { useParams, useHistory, useLocation } from 'react-router-dom'
import { useMutation } from '@apollo/client'
import isEmpty from 'lodash/isEmpty'
import {
  CREATE_APPLICATION,
  APPLICATION_APPLICATIONS,
} from '@island.is/application/graphql'
import {
  Text,
  Box,
  Page,
  Button,
  GridContainer,
} from '@island.is/island-ui/core'
import { coreMessages, getTypeFromSlug } from '@island.is/application/core'
import { ApplicationList } from '@island.is/application/ui-components'
import { ErrorShell, DelegationsScreen } from '@island.is/application/ui-shell'
import {
  useApplicationNamespaces,
  useLocale,
  useLocalizedQuery,
} from '@island.is/localization'

import { ApplicationLoading } from '../components/ApplicationsLoading/ApplicationLoading'
import {
  findProblemInApolloError,
  ProblemType,
} from '@island.is/shared/problem'

export const Applications: FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const history = useHistory()
  const { formatMessage } = useLocale()
  const type = getTypeFromSlug(slug)

  const { search } = useLocation()

  const query = React.useMemo(() => new URLSearchParams(search), [search])

  const [delegationsChecked, setDelegationsChecked] = useState(
    !!query.get('delegationChecked'),
  )
  const checkDelegation = useCallback(() => {
    setDelegationsChecked((d) => !d)
  }, [])

  useApplicationNamespaces(type)

  const {
    data,
    loading,
    error: applicationsError,
    refetch,
  } = useLocalizedQuery(APPLICATION_APPLICATIONS, {
    variables: {
      input: { typeId: type },
    },
    skip: !type,
  })

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
    if (
      type &&
      data &&
      isEmpty(data.applicationApplications) &&
      delegationsChecked
    ) {
      createApplication()
    }
  }, [type, data, delegationsChecked])

  if (loading) {
    return <ApplicationLoading />
  }

  if (!type || applicationsError) {
    const foundError = findProblemInApolloError(applicationsError as any, [
      ProblemType.BAD_SUBJECT,
    ])
    if (
      foundError?.type === ProblemType.BAD_SUBJECT &&
      type &&
      !delegationsChecked
    ) {
      return (
        <DelegationsScreen
          slug={slug}
          alternativeSubjects={foundError.alternativeSubjects}
          checkDelegation={checkDelegation}
        />
      )
    }
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

  if (!delegationsChecked && type) {
    return <DelegationsScreen checkDelegation={checkDelegation} slug={slug} />
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
                refetch={refetch}
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
