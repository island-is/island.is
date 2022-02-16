import React, { FC, useEffect, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { useParams, useHistory } from 'react-router-dom'
import { useAuth } from '@island.is/auth/react'
import isEmpty from 'lodash/isEmpty'
import {
  CREATE_APPLICATION,
  APPLICATION_APPLICATIONS,
  ACTOR_DELEGATIONS,
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
import { ErrorShell } from '@island.is/application/ui-shell'
import {
  useApplicationNamespaces,
  useLocale,
  useLocalizedQuery,
} from '@island.is/localization'
import { getApplicationTemplateByTypeId } from '@island.is/application/template-loader'

import { ApplicationLoading } from '../components/ApplicationsLoading/ApplicationLoading'

type Delegation = {
  type: string
  from: {
    nationalId: string
    name: string
  }
}

export const Applications: FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const history = useHistory()
  const { formatMessage } = useLocale()
  const type = getTypeFromSlug(slug)
  const [allowedDelegations, setAllowedDelegations] = useState<string[]>()
  // const [actorDelegations, setActorDelegations] = useState<Delegation[]>()

  const {  switchUser } = useAuth()

  // Check if template supports delegations
  useEffect(() => {
    async function checkDelegations() {
      if (type) {
        const template = await getApplicationTemplateByTypeId(type)
        if (template.allowedDelegations) {
          setAllowedDelegations(template.allowedDelegations)
        }
      }
    }
    checkDelegations()
  }, [type])

  // Only check if user has delegations if the template supports delegations
  const {
    data: delegations,
    error: delegationError,
  } = useQuery(ACTOR_DELEGATIONS, { skip: !allowedDelegations })

  // Check if user has the delegations of the delegation types the application supports
  // useEffect(() => {
  //   if (delegations && allowedDelegations && !actorDelegations) {
  //     console.log(allowedDelegations)
  //     console.log(delegations.authActorDelegations)
  //     const del: Delegation[] = delegations.authActorDelegations.filter(
  //       (delegation: Delegation) =>
  //         allowedDelegations.includes(delegation.type),
  //     )
  //     setActorDelegations(del)
  //     console.log('actor del', actorDelegations, typeof del, del)
  //   }
  // }, [delegations, allowedDelegations])

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

  if (delegations && allowedDelegations) {
    return (
      <Page>
        <GridContainer>
          <Box>
            <Box marginTop={5} marginBottom={5}>
              <Text variant="h1">Þessi umsókn styður umboð.</Text>
            </Box>
            {delegations.authActorDelegations.map((delegation: Delegation) => {
              if (allowedDelegations.includes(delegation.type)) {
                return (
                  <Box
                    marginTop={5}
                    marginBottom={5}
                    display="flex"
                    justifyContent="flexEnd"
                    key={delegation.from.nationalId}
                  >
                    <Text variant="h1">{delegation.from.name}</Text>
                    <Button onClick={() =>switchUser(delegation.from.nationalId)}>
                      {formatMessage(coreMessages.newApplication)}
                    </Button>
                  </Box>
                )
              }
            })}
          </Box>
        </GridContainer>
      </Page>
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
