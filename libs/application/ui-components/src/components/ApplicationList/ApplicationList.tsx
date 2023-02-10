import React, { ReactNode, useCallback, useState } from 'react'
import { MessageDescriptor } from '@formatjs/intl'
import format from 'date-fns/format'

import {
  ActionCard,
  AlertMessage,
  Box,
  Button,
  Pagination,
  Stack,
} from '@island.is/island-ui/core'
import { coreMessages, getSlugFromType } from '@island.is/application/core'
import {
  Application,
  ApplicationStatus,
  ActionCardTag,
  ApplicationTypes,
  PendingActionDisplayStatus,
} from '@island.is/application/types'
import { institutionMapper } from '@island.is/application/core'
import { useLocale } from '@island.is/localization'
import { dateFormat } from '@island.is/shared/constants'
import { useDeleteApplication } from './hooks/useDeleteApplication'
import { getOrganizationLogoUrl } from '@island.is/shared/utils'
import { Organization } from '@island.is/shared/types'

const pageSize = 5
interface DefaultStateData {
  tag: {
    variant: ActionCardTag
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
      variant: 'red',
      label: coreMessages.tagsRejected,
    },
    progress: {
      variant: 'red',
    },
    cta: {
      label: coreMessages.cardButtonRejected,
    },
  },
  [ApplicationStatus.COMPLETED]: {
    tag: {
      variant: 'mint',
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
      variant: 'blueberry',
      label: coreMessages.tagsInProgress,
    },
    progress: {
      variant: 'blue',
    },
    cta: {
      label: coreMessages.cardButtonInProgress,
    },
  },
  [ApplicationStatus.DRAFT]: {
    tag: {
      variant: 'blue',
      label: coreMessages.tagsDraft,
    },
    progress: {
      variant: 'blue',
    },
    cta: {
      label: coreMessages.cardButtonDraft,
    },
  },
  [ApplicationStatus.APPROVED]: {
    tag: {
      variant: 'mint',
      label: coreMessages.tagsApproved,
    },
    progress: {
      variant: 'mint',
    },
    cta: {
      label: coreMessages.cardButtonApproved,
    },
  },
  [ApplicationStatus.NOT_STARTED]: {
    tag: {
      variant: 'blueberry',
      label: coreMessages.newApplication,
    },
    progress: {
      variant: 'blue',
    },
    cta: {
      label: coreMessages.cardButtonNotStarted,
    },
  },
}

type ApplicationFields = Pick<
  Application,
  | 'actionCard'
  | 'id'
  | 'typeId'
  | 'status'
  | 'modified'
  | 'name'
  | 'progress'
  | 'history'
>

interface Props {
  organizations?: Organization[]
  applications: ApplicationFields[]
  onClick: (id: string) => void
  refetch?: (() => void) | undefined
  focus?: boolean
}

const ApplicationList = ({
  organizations,
  applications,
  onClick,
  refetch,
  focus = false,
}: Props) => {
  const { lang: locale, formatMessage } = useLocale()
  const formattedDate = locale === 'is' ? dateFormat.is : dateFormat.en
  const [page, setPage] = useState<number>(1)

  const handlePageChange = useCallback((page: number) => setPage(page), [])

  const pagedDocuments = {
    from: (page - 1) * pageSize,
    to: pageSize * page,
    totalPages: Math.ceil(applications.length / pageSize),
  }

  const { deleteApplication } = useDeleteApplication(refetch)

  const handleDeleteApplication = (applicationId: string) => {
    deleteApplication(applicationId)
  }

  const getLogo = (typeId: ApplicationTypes): string => {
    if (!organizations) {
      return ''
    }
    const institutionSlug = institutionMapper[typeId]
    const institution = organizations.find((x) => x.slug === institutionSlug)
    return getOrganizationLogoUrl(
      institution?.title ?? 'stafraent-island',
      organizations,
    )
  }

  const buildHistoryItems = (application: ApplicationFields) => {
    if (application.status === ApplicationStatus.DRAFT) return

    let history: {
      title: string
      date?: string
      content?: ReactNode
    }[] = []

    const mapStatusToAlertType = (status?: PendingActionDisplayStatus) => {
      switch (status) {
        case 'actionable':
          return 'warning'
        case 'completed':
          return 'success'
        case 'inprogress':
          return 'info'
        case 'rejected':
          return 'error'
        default:
          return 'default'
      }
    }

    if (application.actionCard?.pendingAction?.title) {
      history.push({
        date: format(new Date(), formattedDate),
        title: formatMessage(application.actionCard.pendingAction.title ?? ''),
        content: application.actionCard.pendingAction.content ? (
          <AlertMessage
            type={mapStatusToAlertType(
              application.actionCard?.pendingAction?.displayStatus,
            )}
            message={formatMessage(
              application.actionCard.pendingAction.content ?? '',
            )}
            action={
              <Box>
                <Button
                  variant="text"
                  size="small"
                  nowrap
                  onClick={() =>
                    onClick(
                      `${getSlugFromType(application.typeId)}/${
                        application.id
                      }`,
                    )
                  }
                  icon="pencil"
                >
                  {formatMessage(coreMessages.cardButtonDraft)}
                </Button>
              </Box>
            }
          />
        ) : undefined,
      })
    }

    if (application.history) {
      history = history.concat(
        application.history.map((x) => ({
          date: format(new Date(x.date), formattedDate),
          title: formatMessage(x.entry),
        })),
      )
    }

    return history
  }

  return (
    <>
      <Stack space={2}>
        {applications
          .slice(pagedDocuments.from, pagedDocuments.to)
          .map((application, index: number) => {
            const actionCard = application.actionCard
            const stateDefaultData =
              DefaultData[application.status] ||
              DefaultData[ApplicationStatus.IN_PROGRESS]
            const slug = getSlugFromType(application.typeId)
            const historyItems = buildHistoryItems(application)
            const showHistory =
              application.status !== ApplicationStatus.DRAFT &&
              historyItems &&
              historyItems.length > 0

            if (!slug) {
              return null
            }

            return (
              <ActionCard
                logo={getLogo(application.typeId)}
                key={`${application.id}-${index}`}
                date={format(new Date(application.modified), formattedDate)}
                tag={{
                  label: actionCard?.tag?.label
                    ? formatMessage(actionCard.tag.label)
                    : formatMessage(stateDefaultData.tag.label),
                  variant:
                    actionCard?.tag?.variant || stateDefaultData.tag.variant,
                  outlined: false,
                }}
                backgroundColor="white"
                focused={focus}
                heading={actionCard?.title ?? application.name}
                text={actionCard?.description}
                cta={{
                  label: showHistory
                    ? ''
                    : formatMessage(stateDefaultData.cta.label),
                  variant: 'ghost',
                  size: 'small',
                  icon: undefined,
                  onClick: () => onClick(`${slug}/${application.id}`),
                }}
                progressMeter={
                  showHistory
                    ? undefined
                    : {
                        active: Boolean(application.progress),
                        progress: application.progress,
                        variant: stateDefaultData.progress.variant,
                      }
                }
                history={{
                  openButtonLabel: formatMessage(
                    coreMessages.openApplicationHistoryLabel,
                  ),
                  closeButtonLabel: formatMessage(
                    coreMessages.closeApplicationHistoryLabel,
                  ),
                  items: historyItems,
                }}
                deleteButton={{
                  visible: actionCard?.deleteButton,
                  onClick: handleDeleteApplication.bind(null, application.id),
                  disabled: false,
                  icon: 'trash',
                  dialogTitle:
                    coreMessages.deleteApplicationDialogTitle.defaultMessage,
                  dialogDescription:
                    coreMessages.deleteApplicationDialogDescription
                      .defaultMessage,
                  dialogConfirmLabel:
                    coreMessages.deleteApplicationDialogConfirmLabel
                      .defaultMessage,
                  dialogCancelLabel:
                    coreMessages.deleteApplicationDialogCancelLabel
                      .defaultMessage,
                }}
              />
            )
          })}
      </Stack>
      {applications.length > pageSize ? (
        <Box marginTop={4}>
          <Pagination
            page={page}
            totalPages={pagedDocuments.totalPages}
            renderLink={(page, className, children) => (
              <button
                className={className}
                onClick={() => {
                  handlePageChange(page)
                }}
              >
                {children}
              </button>
            )}
          />
        </Box>
      ) : null}
    </>
  )
}

export default ApplicationList
