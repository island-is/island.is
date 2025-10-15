import React, { FC, useEffect, useState } from 'react'

import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { useMutation } from '@apollo/client'
import isEmpty from 'lodash/isEmpty'
import {
  CREATE_APPLICATION,
  APPLICATION_APPLICATIONS,
} from '@island.is/application/graphql'
import { FORM_SYSTEM_APPLICATIONS } from '@island.is/form-system/graphql'
import {
  Text,
  Box,
  Page,
  Button,
  GridContainer,
} from '@island.is/island-ui/core'
import { coreMessages, getTypeFromSlug } from '@island.is/application/core'
import { ApplicationList } from '@island.is/application/ui-components'
import {
  ErrorShell,
  DelegationsScreen,
  useApplicationNamespaces,
} from '@island.is/application/ui-shell'
import { useLocale, useLocalizedQuery } from '@island.is/localization'

import { ApplicationLoading } from '../components/ApplicationsLoading/ApplicationLoading'
import {
  findProblemInApolloError,
  ProblemType,
} from '@island.is/shared/problem'
import { getApplicationTemplateByTypeId } from '@island.is/application/template-loader'
import {
  Application,
  ApplicationContext,
  ApplicationStateSchema,
  ApplicationTemplate,
} from '@island.is/application/types'
import { EventObject } from 'xstate'
import { form } from 'libs/application/templates/general-petition/src/forms/form'

type UseParams = {
  slug: string
}

export const Applications: FC<React.PropsWithChildren<unknown>> = () => {
  const { slug } = useParams() as UseParams
  const navigate = useNavigate()
  const { formatMessage } = useLocale()
  const type = getTypeFromSlug(slug)

  const { search } = useLocation()

  const query = React.useMemo(() => new URLSearchParams(search), [search])
  const [delegationsChecked, setDelegationsChecked] = useState(
    !!query.get('delegationChecked'),
  )
  const [template, setTemplate] = useState<
    | ApplicationTemplate<
        ApplicationContext,
        ApplicationStateSchema<EventObject>,
        EventObject
      >
    | undefined
  >(undefined)

  const queryParam = template?.initialQueryParameter
    ? query.get(template?.initialQueryParameter)
    : null

  useApplicationNamespaces(type)

  const {
    data: applicationsData,
    loading: applicationsLoading,
    error: applicationsError,
    refetch: refetchApplications,
  } = useLocalizedQuery(APPLICATION_APPLICATIONS, {
    variables: { input: { typeId: type } },
    skip: !type && !delegationsChecked,
    fetchPolicy: 'cache-and-network',
  })

  const {
    data: formSystemData,
    loading: formSystemLoading,
    error: formSystemError,
    refetch: refetchFormSystemApplications,
  } = useLocalizedQuery(FORM_SYSTEM_APPLICATIONS, {
    skip: !type && !delegationsChecked,
    fetchPolicy: 'cache-and-network',
  })

  // Combine and sort applications from both sources
  const applicationsA = applicationsData?.applicationApplications ?? []
  const applicationsB = formSystemData?.formSystemApplications ?? []

  const combinedApplications: Application[] = React.useMemo(() => {
    if (!applicationsA.length && !applicationsB.length) return []
    const map = new Map<string, Application>()
    ;[...applicationsA, ...applicationsB].forEach((app) => {
      if (app) {
        // Last one wins if duplicate ids appear
        map.set(app.id, app)
      }
    })
    return Array.from(map.values()).sort((a, b) => {
      const aTime = a.modified ? new Date(a.modified).getTime() : 0
      const bTime = b.modified ? new Date(b.modified).getTime() : 0
      return bTime - aTime
    })
  }, [applicationsA, applicationsB])

  console.log('combinedApplications', combinedApplications)

  const loading = applicationsLoading || formSystemLoading
  const error = applicationsError || formSystemError

  const refetch = async () => {
    await Promise.all([refetchApplications(), refetchFormSystemApplications()])
  }

  const [createApplicationMutation, { error: createError }] = useMutation(
    CREATE_APPLICATION,
    {
      onCompleted({ createApplication }) {
        if (slug) {
          navigate(`../${slug}/${createApplication.id}`)
        }
      },
    },
  )

  const createApplication = () => {
    createApplicationMutation({
      variables: {
        input: {
          typeId: type,
          initialQuery: queryParam,
        },
      },
    })
  }

  useEffect(() => {
    const getTemplate = async () => {
      if (type && !template) {
        const appliTemplate = await getApplicationTemplateByTypeId(type)
        if (appliTemplate) {
          setTemplate(appliTemplate)
        }
      }
    }
    getTemplate().catch(console.error)
  }, [type, template])

  useEffect(() => {
    if (type && isEmpty(combinedApplications) && delegationsChecked) {
      createApplication()
    }
  }, [type, combinedApplications, delegationsChecked])

  if (loading) {
    return <ApplicationLoading />
  }

  if (!template) {
    return <ErrorShell errorType="notExist" />
  }

  if (!type || applicationsError) {
    const foundError = findProblemInApolloError(applicationsError as any, [
      ProblemType.BAD_SUBJECT,
    ])

    const isBadSubject = foundError?.type === ProblemType.BAD_SUBJECT

    if (slug && isBadSubject && type && !delegationsChecked) {
      return (
        <DelegationsScreen
          slug={slug}
          alternativeSubjects={foundError.alternativeSubjects}
          checkDelegation={setDelegationsChecked}
        />
      )
    }
    if (isBadSubject) {
      return <ErrorShell errorType="badSubject" />
    }
    return <ErrorShell errorType="notExist" />
  }

  if (createError) {
    return (
      <ErrorShell
        title={formatMessage(coreMessages.createErrorApplication)}
        subTitle={formatMessage(coreMessages.createErrorApplicationMessage, {
          type,
        })}
        description=""
      />
    )
  }

  if (!delegationsChecked && type && slug) {
    return (
      <DelegationsScreen checkDelegation={setDelegationsChecked} slug={slug} />
    )
  }

  const numberOfApplicationsInDraft = combinedApplications.filter(
    (x: Application) => x.state === 'draft',
  ).length

  const shouldRenderNewApplicationButton =
    template.allowMultipleApplicationsInDraft === undefined
      ? true
      : template.allowMultipleApplicationsInDraft ||
        numberOfApplicationsInDraft < 1

  return (
    <Page>
      <GridContainer>
        {!loading && !isEmpty(combinedApplications) && (
          <Box marginBottom={5}>
            <Box
              marginTop={5}
              marginBottom={5}
              justifyContent="spaceBetween"
              display="flex"
              flexDirection={['column', 'row']}
            >
              <Text variant="h1">
                {template.applicationText
                  ? formatMessage(template.applicationText)
                  : formatMessage(coreMessages.applications)}
              </Text>
              {shouldRenderNewApplicationButton ? (
                <Box marginTop={[2, 0]}>
                  <Button
                    onClick={createApplication}
                    data-testid="create-new-application"
                  >
                    {template.newApplicationButtonLabel
                      ? formatMessage(template.newApplicationButtonLabel)
                      : formatMessage(coreMessages.newApplication)}
                  </Button>
                </Box>
              ) : null}
            </Box>

            {combinedApplications && (
              <ApplicationList
                applications={combinedApplications}
                onClick={(applicationUrl) => navigate(`../${applicationUrl}`)}
                refetch={refetch}
              />
            )}
          </Box>
        )}
      </GridContainer>
    </Page>
  )
}
