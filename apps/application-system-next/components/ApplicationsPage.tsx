'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation } from '@apollo/client'
import isEmpty from 'lodash/isEmpty'
import {
  Text,
  Box,
  Page,
  Button,
  GridContainer,
  LoadingDots,
} from '@island.is/island-ui/core'
import {
  CREATE_APPLICATION,
  APPLICATION_CARDS,
  GET_ORGANIZATIONS,
} from '@island.is/application/graphql'
import { coreMessages, getTypeFromSlug } from '@island.is/application/core'
import { ApplicationList } from '@island.is/application/ui-components'
import { ErrorShell } from '@island.is/application/ui-shell'
import { useLocale, useLocalizedQuery } from '@island.is/localization'
import {
  findProblemInApolloError,
  ProblemType,
} from '@island.is/shared/problem'
import type { ApplicationCard } from '@island.is/application/types'
import type { Organization } from '@island.is/shared/types'
import { useHeaderInfo } from './HeaderInfoProvider'

interface ApplicationsPageProps {
  slug: string
}

export const ApplicationsPage = ({ slug }: ApplicationsPageProps) => {
  const router = useRouter()
  const { formatMessage } = useLocale()
  const { clearInfo } = useHeaderInfo()
  const type = getTypeFromSlug(slug)

  useEffect(() => {
    clearInfo()
  }, [clearInfo])

  const { data, loading, error, refetch } = useLocalizedQuery(
    APPLICATION_CARDS,
    {
      variables: {
        input: { typeId: type },
      },
      skip: !type,
      fetchPolicy: 'cache-and-network',
    },
  )

  const { data: orgData, loading: loadingOrg } = useLocalizedQuery(
    GET_ORGANIZATIONS,
    {
      fetchPolicy: 'cache-and-network',
    },
  )

  const mappedOrganizations = (data?.ApplicationSystemCard ?? []).map(
    (card: ApplicationCard) => {
      const org = orgData?.getOrganizations?.items.find(
        (o: Organization) => o.id === card.orgContentfulId,
      )
      return {
        ...org,
        slug: card.org ?? '',
      }
    },
  )

  const [createApplicationMutation, { error: createError }] = useMutation(
    CREATE_APPLICATION,
    {
      onCompleted({ createApplication }) {
        if (slug) {
          // Root-relative; Next prepends the configured `basePath`
          // (`/umsoknir/sdf`) automatically.
          router.push(`/${slug}/${createApplication.id}`)
        }
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
    if (type && data && isEmpty(data.ApplicationSystemCard)) {
      createApplication()
    }
  }, [type, data])

  if (!type) {
    return (
      <Page>
        <GridContainer>
          <Box marginTop={5}>
            <Text variant="h1">
              {formatMessage(coreMessages.createErrorApplication)}
            </Text>
          </Box>
        </GridContainer>
      </Page>
    )
  }

  if (loading || loadingOrg) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        width="full"
        style={{ minHeight: '40vh' }}
      >
        <LoadingDots size="large" />
      </Box>
    )
  }

  if (error) {
    const isBadSubject =
      findProblemInApolloError(error, [ProblemType.BAD_SUBJECT])?.type ===
      ProblemType.BAD_SUBJECT
    return <ErrorShell errorType={isBadSubject ? 'badSubject' : 'notExist'} />
  }

  if (createError) {
    return (
      <Page>
        <GridContainer>
          <Box marginTop={5}>
            <Text variant="h1">
              {formatMessage(coreMessages.createErrorApplication)}
            </Text>
            <Text marginTop={2}>
              {formatMessage(coreMessages.createErrorApplicationMessage, {
                type,
              })}
            </Text>
          </Box>
        </GridContainer>
      </Page>
    )
  }

  return (
    <Page>
      <GridContainer>
        {!isEmpty(data?.ApplicationSystemCard) && (
          <Box marginBottom={5}>
            <Box
              marginTop={5}
              marginBottom={5}
              justifyContent="spaceBetween"
              display="flex"
              flexDirection={['column', 'row']}
            >
              <Text variant="h1">
                {formatMessage(coreMessages.applications)}
              </Text>
              <Box marginTop={[2, 0]}>
                <Button
                  onClick={createApplication}
                  data-testid="create-new-application"
                >
                  {formatMessage(coreMessages.newApplication)}
                </Button>
              </Box>
            </Box>

            {data?.ApplicationSystemCard && (
              <ApplicationList
                applications={data.ApplicationSystemCard}
                organizations={mappedOrganizations as Organization[]}
                onClick={(applicationUrl) => router.push(`/${applicationUrl}`)}
                refetch={refetch}
              />
            )}
          </Box>
        )}
      </GridContainer>
    </Page>
  )
}
