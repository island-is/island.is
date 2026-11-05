import { useNavigate } from 'react-router-dom'

import { ActionCard, ProblemTemplate, Stack } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { ActionCardLoader, formatDate } from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'

import {
  EQUALITY_PLAN_APPLICATION_SLUG,
  SALARY_REPORT_APPLICATION_SLUG,
} from '../../lib/constants'
import { messages } from '../../lib/messages'
import { DirectorateOfEqualityPaths } from '../../lib/paths'
import { getStatusTag } from '../../lib/status'
import { useDirectorateOfEqualitySubmissionsQuery } from '../../mocks/hooks'
import {
  DirectorateOfEqualitySubmission,
  DirectorateOfEqualitySubmissionStatus,
  DirectorateOfEqualitySubmissionType,
} from '../../mocks/types'

export const SubmissionsTabContent = ({
  type,
  hasAccess,
}: {
  type: DirectorateOfEqualitySubmissionType
  hasAccess: boolean
}) => {
  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const isPlan = type === DirectorateOfEqualitySubmissionType.EQUALITY_PLAN
  const { data, loading, error } = useDirectorateOfEqualitySubmissionsQuery({
    variables: { input: { type } },
    skip: !hasAccess,
  })
  const items: DirectorateOfEqualitySubmission[] =
    data?.directorateOfEqualitySubmissions.items ?? []

  if (!hasAccess) {
    return (
      <ProblemTemplate
        variant="info"
        tag={formatMessage(messages.serviceProviderTag)}
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
      <ProblemTemplate
        variant="info"
        tag={formatMessage(messages.serviceProviderTag)}
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
        const heading = isPlan
          ? formatMessage(messages.planTitle, {
              from: item.periodFrom,
              to: item.periodTo,
            })
          : formatMessage(messages.reportTitle, { year: item.year })

        return (
          <ActionCard
            key={item.id}
            heading={heading}
            headingVariant="h4"
            text={formatMessage(messages.submittedOn, {
              date: formatDate(item.submittedAt),
            })}
            tag={{
              ...getStatusTag(item.status, formatMessage),
              outlined: true,
            }}
            cta={
              item.status === DirectorateOfEqualitySubmissionStatus.IN_REVIEW
                ? {
                    label: formatMessage(messages.openApplication),
                    ariaLabel: formatMessage(
                      messages.openApplicationAriaLabel,
                      { title: heading },
                    ),
                    variant: 'text',
                    size: 'small',
                    icon: 'open',
                    iconType: 'outline',
                    onClick: () =>
                      window.open(
                        `${document.location.origin}/umsoknir/${
                          isPlan
                            ? EQUALITY_PLAN_APPLICATION_SLUG
                            : SALARY_REPORT_APPLICATION_SLUG
                        }`,
                        '_blank',
                        'noopener',
                      ),
                  }
                : {
                    label: formatMessage(messages.view),
                    ariaLabel: formatMessage(messages.viewAriaLabel, {
                      title: heading,
                    }),
                    variant: 'text',
                    size: 'small',
                    icon: 'arrowForward',
                    onClick: () =>
                      navigate(
                        (isPlan
                          ? DirectorateOfEqualityPaths.PlanDetail
                          : DirectorateOfEqualityPaths.ReportDetail
                        ).replace(':id', item.id),
                      ),
                  }
            }
          />
        )
      })}
    </Stack>
  )
}
