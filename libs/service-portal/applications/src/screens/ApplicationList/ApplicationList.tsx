import React from 'react'
import format from 'date-fns/format'
import { MessageDescriptor } from 'react-intl'
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
  ActionCard,
} from '@island.is/island-ui/core'
import { useApplications } from '@island.is/service-portal/graphql'
import {
  Application,
  ApplicationStatus,
  getSlugFromType,
  TagVariant,
} from '@island.is/application/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import * as Sentry from '@sentry/react'
import { dateFormat } from '@island.is/shared/constants'

import { m } from '../../lib/messages'

const isLocalhost = window.location.origin.includes('localhost')
const isDev = window.location.origin.includes('beta.dev01.devland.is')
const isStaging = window.location.origin.includes('beta.staging01.devland.is')

const baseUrlForm = isLocalhost
  ? 'http://localhost:4242/umsoknir'
  : isDev
  ? 'https://beta.dev01.devland.is/umsoknir'
  : isStaging
  ? 'https://beta.staging01.devland.is/umsoknir'
  : 'https://island.is/umsoknir'

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
      label: m.cardStatusRejected,
    },
    progress: {
      variant: 'red',
    },
    cta: {
      label: m.cardButtonInProgress,
    },
  },
  [ApplicationStatus.COMPLETED]: {
    tag: {
      variant: TagVariant.BLUEBERRY,
      label: m.cardStatusDone,
    },
    progress: {
      variant: 'mint',
    },
    cta: {
      label: m.cardButtonComplete,
    },
  },
  [ApplicationStatus.IN_PROGRESS]: {
    tag: {
      variant: TagVariant.BLUE,
      label: m.cardStatusInProgress,
    },
    progress: {
      variant: 'blue',
    },
    cta: {
      label: m.cardButtonInProgress,
    },
  },
}

const ApplicationList: ServicePortalModuleComponent = () => {
  useNamespaces('sp.applications')

  Sentry.configureScope((scope) => scope.setTransactionName('Applications'))

  const { formatMessage, lang: locale } = useLocale()
  const { data: applications, loading, error } = useApplications()
  const formattedDate = locale === 'is' ? dateFormat.is : dateFormat.en

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

      <Stack space={2}>
        {applications.map((application: Application, index: number) => {
          const stateMetaData = application.stateMetaData
          const stateDefaultData =
            ApplicationStateDisplayedData[application.status] ||
            ApplicationStateDisplayedData[ApplicationStatus.IN_PROGRESS]
          const slug = getSlugFromType(application.typeId)

          if (!slug) {
            return null
          }

          return (
            <ActionCard
              key={`${application.id}-${index}`}
              date={format(new Date(application.modified), formattedDate)}
              heading={application.name || application.typeId}
              tag={{
                label: stateMetaData?.tag?.label
                  ? formatMessage(stateMetaData?.tag?.label)
                  : formatMessage(stateDefaultData.tag.label),
                variant:
                  stateMetaData?.tag?.variant || stateDefaultData.tag.variant,
                outlined: false,
              }}
              cta={{
                label: formatMessage(stateDefaultData.cta.label),
                variant: 'ghost',
                size: 'small',
                icon: undefined,
                onClick: () =>
                  window.open(`${baseUrlForm}/${slug}/${application.id}`),
              }}
              text={application.stateMetaData?.description}
              progressMeter={{
                active: Boolean(application.progress),
                progress: application.progress,
                variant: stateDefaultData.progress.variant,
              }}
            />
          )
        })}
      </Stack>
    </>
  )
}

export default ApplicationList
