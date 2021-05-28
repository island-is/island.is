import React from 'react'
import { MessageDescriptor } from '@formatjs/intl'
import format from 'date-fns/format'

import { ActionCard, Stack } from '@island.is/island-ui/core'
import {
  Application,
  ApplicationStatus,
  coreMessages,
  getSlugFromType,
  TagVariant,
} from '@island.is/application/core'
import { useLocale } from '@island.is/localization'
import { dateFormat } from '@island.is/shared/constants'

interface DefaultStateData {
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

const DefaultData: Record<ApplicationStatus, DefaultStateData> = {
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

interface Props {
  applications: Application[]
  onClick: (id: string) => void
}

const ApplicationList = ({ applications, onClick }: Props) => {
  const { lang: locale, formatMessage } = useLocale()
  const formattedDate = locale === 'is' ? dateFormat.is : dateFormat.en

  return (
    <Stack space={2}>
      {applications.map((application, index: number) => {
        const stateMetaData = application.stateMetaData
        const stateDefaultData =
          DefaultData[application.status] ||
          DefaultData[ApplicationStatus.IN_PROGRESS]
        const slug = getSlugFromType(application.typeId)

        if (!slug) {
          return null
        }
        return (
          <ActionCard
            key={`${application.id}-${index}`}
            date={format(new Date(application.modified), formattedDate)}
            tag={{
              label: stateMetaData?.tag?.label
                ? formatMessage(stateMetaData?.tag?.label)
                : formatMessage(stateDefaultData.tag.label),
              variant:
                stateMetaData?.tag?.variant || stateDefaultData.tag.variant,
              outlined: false,
            }}
            heading={application.name || application.typeId}
            text={application.stateMetaData?.description}
            cta={{
              label: formatMessage(stateDefaultData.cta.label),
              variant: 'ghost',
              size: 'small',
              icon: undefined,
              onClick: () => onClick(`${slug}/${application.id}`),
            }}
            progressMeter={{
              active: Boolean(application.progress),
              progress: application.progress,
              variant: stateDefaultData.progress.variant,
            }}
          />
        )
      })}
    </Stack>
  )
}

export default ApplicationList
