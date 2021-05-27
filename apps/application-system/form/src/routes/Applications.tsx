import React, { FC, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { useParams, useHistory } from 'react-router-dom'
import { MessageDescriptor } from '@formatjs/intl'
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
  TagVariant,
} from '@island.is/application/core'
import { NotFound } from '@island.is/application/ui-shell'
import {
  useApplicationNamespaces,
  useLocale,
  useLocalizedQuery,
} from '@island.is/localization'
import { dateFormat } from '@island.is/shared/constants'

import { ApplicationLoading } from '../components/ApplicationsLoading/ApplicationLoading'

interface StateData {
  tag: {
    variant: TagVariant
    label: MessageDescriptor
  }
  progress: {
    variant: 'blue' | 'red' | 'rose' | 'mint'
  }
  cta: {
    label: MessageDescriptor
  }
}

const ApplicationStateDisplayedData: Record<ApplicationStatus, StateData> = {
  [ApplicationStatus.REJECTED]: {
    tag: {
      variant: TagVariant.RED,
      label: coreMessages.tagsRejected,
    },
    progress: {
      variant: 'red',
    },
    cta: {
      label: coreMessages.cardButtonInProgress,
    },
  },
  [ApplicationStatus.COMPLETED]: {
    tag: {
      variant: TagVariant.BLUEBERRY,
      label: coreMessages.tagsDone,
    },
    progress: {
      variant: 'mint',
    },
    cta: {
      label: coreMessages.cardButtonComplete,
    },
  },
  [ApplicationStatus.IN_PROGRESS]: {
    tag: {
      variant: TagVariant.BLUE,
      label: coreMessages.tagsInProgress,
    },
    progress: {
      variant: 'blue',
    },
    cta: {
      label: coreMessages.cardButtonInProgress,
    },
  },
}

export const Applications: FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const history = useHistory()
  const { lang: locale, formatMessage } = useLocale()
  const type = getTypeFromSlug(slug)
  const formattedDate = locale === 'is' ? dateFormat.is : dateFormat.en

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
                (application: Application, index: number) => {
                  const stateMetaData = application.stateMetaData
                  const stateDefaultData =
                    ApplicationStateDisplayedData[application.status] ||
                    ApplicationStateDisplayedData[ApplicationStatus.IN_PROGRESS]
                  return (
                    <ActionCard
                      key={`${application.id}-${index}`}
                      date={format(
                        new Date(application.modified),
                        formattedDate,
                      )}
                      tag={{
                        label: stateMetaData?.tag?.label
                          ? formatMessage(stateMetaData?.tag?.label)
                          : formatMessage(stateDefaultData.tag.label),
                        variant:
                          stateMetaData?.tag?.variant ||
                          stateDefaultData.tag.variant,
                        outlined: false,
                      }}
                      heading={application.name || application.typeId}
                      text={application.stateMetaData?.description}
                      cta={{
                        label: formatMessage(stateDefaultData.cta.label),
                        variant: 'ghost',
                        size: 'small',
                        icon: undefined,
                        onClick: () =>
                          history.push(`../${slug}/${application.id}`),
                      }}
                      progressMeter={{
                        active: Boolean(application.progress),
                        progress: application.progress,
                        variant: stateDefaultData.progress.variant,
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
