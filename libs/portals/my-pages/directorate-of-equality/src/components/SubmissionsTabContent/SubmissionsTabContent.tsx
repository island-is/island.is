import {
  DirectorateOfEqualitySubmissionChannel,
  DirectorateOfEqualitySubmissionStatus,
  DirectorateOfEqualitySubmissionType,
} from '@island.is/api/schema'
import { Stack } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  ActionCard,
  ActionCardLoader,
  formatDate,
  m as coreMessages,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'

import {
  EQUALITY_PLAN_APPLICATION_SLUG,
  SALARY_REPORT_APPLICATION_SLUG,
} from '../../lib/constants'
import { getPeriodYear } from '../../lib/format'
import { messages } from '../../lib/messages'
import { DirectorateOfEqualityPaths } from '../../lib/paths'
import { getStatusTag } from '../../lib/status'
import { useDirectorateOfEqualitySubmissionsQuery } from './SubmissionsTabContent.generated'

const getYear = (date?: string | null) =>
  date ? new Date(date).getFullYear() : null

export const SubmissionsTabContent = ({
  type,
  hasAccess,
}: {
  type: DirectorateOfEqualitySubmissionType
  hasAccess: boolean
}) => {
  const { formatMessage } = useLocale()
  const isPlan = type === DirectorateOfEqualitySubmissionType.EQUALITY_PLAN
  const { data, loading, error } = useDirectorateOfEqualitySubmissionsQuery({
    variables: { input: { type } },
    skip: !hasAccess,
  })
  const items = data?.directorateOfEqualitySubmissions?.items ?? []

  const getHeading = (item: {
    approvedAt?: string | null
    validUntil?: string | null
    salaryDataPeriod?: string | null
  }) => {
    if (isPlan) {
      const from = getYear(item.approvedAt)
      const to = getYear(item.validUntil)
      return from && to
        ? formatMessage(messages.planTitle, { from, to })
        : formatMessage(coreMessages.equalityPlan)
    }
    const year = getPeriodYear(item.salaryDataPeriod)
    return year
      ? formatMessage(messages.reportTitle, { year })
      : formatMessage(coreMessages.equalityReport)
  }

  if (!hasAccess) {
    return (
      <Problem
        type="no_data"
        noBorder={false}
        title={formatMessage(messages.noAccessTitle)}
        message={formatMessage(
          isPlan
            ? messages.noAccessPlansMessage
            : messages.noAccessReportsMessage,
        )}
        imgSrc="./assets/images/jobsGrid.svg"
        titleSize="h2"
      />
    )
  }

  if (loading) {
    return <ActionCardLoader repeat={3} />
  }

  if (error) {
    return <Problem error={error} noBorder={false} />
  }

  if (items.length === 0) {
    return (
      <Problem
        type="no_data"
        noBorder={false}
        title={formatMessage(messages.noSubmissionsTitle)}
        message={formatMessage(
          isPlan ? messages.noPlansMessage : messages.noReportsMessage,
        )}
        imgSrc="./assets/images/nodata.svg"
        titleSize="h2"
      />
    )
  }

  return (
    <Stack space={2}>
      {items.map((item) => {
        const heading = getHeading(item)
        const statusTag = getStatusTag(item.status, formatMessage)
        const canOpenApplication =
          item.status === DirectorateOfEqualitySubmissionStatus.IN_REVIEW &&
          item.submittedVia === DirectorateOfEqualitySubmissionChannel.ISLAND_IS

        return (
          <ActionCard
            key={item.id}
            heading={heading}
            text={
              item.submittedAt
                ? formatMessage(messages.submittedOn, {
                    date: formatDate(item.submittedAt),
                  })
                : undefined
            }
            tag={statusTag ? { ...statusTag, outlined: true } : undefined}
            cta={
              canOpenApplication
                ? {
                    label: formatMessage(messages.openApplication),
                    variant: 'text',
                    size: 'small',
                    ariaLabel: formatMessage(
                      messages.openApplicationAriaLabel,
                      { title: heading },
                    ),
                    url: `${document.location.origin}/umsoknir/${
                      isPlan
                        ? EQUALITY_PLAN_APPLICATION_SLUG
                        : SALARY_REPORT_APPLICATION_SLUG
                    }/${encodeURIComponent(item.id)}`,
                  }
                : {
                    label: formatMessage(coreMessages.view),
                    variant: 'text',
                    size: 'small',
                    ariaLabel: formatMessage(messages.viewAriaLabel, {
                      title: heading,
                    }),
                    icon: 'arrowForward',
                    url: (isPlan
                      ? DirectorateOfEqualityPaths.PlanDetail
                      : DirectorateOfEqualityPaths.ReportDetail
                    ).replace(':id', encodeURIComponent(item.id)),
                  }
            }
          />
        )
      })}
    </Stack>
  )
}
