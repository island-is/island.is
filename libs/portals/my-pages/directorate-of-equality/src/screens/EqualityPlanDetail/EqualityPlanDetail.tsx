import { useParams } from 'react-router-dom'

import { Button } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  formatDate,
  formatNationalId,
  InfoLine,
  InfoLineStack,
  IntroWrapper,
  JAFNRETTISSTOFA_SLUG,
  m as coreMessages,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'

import { NAMESPACE } from '../../lib/constants'
import { messages } from '../../lib/messages'
import { getStatusTag } from '../../lib/status'
import { useDirectorateOfEqualityEqualityPlanQuery } from '../../mocks/hooks'

const EqualityPlanDetail = () => {
  useNamespaces(NAMESPACE)
  const { formatMessage } = useLocale()
  const { id } = useParams() as { id: string }
  const { data, loading, error } = useDirectorateOfEqualityEqualityPlanQuery({
    variables: { input: { id } },
  })
  const plan = data?.directorateOfEqualityEqualityPlan

  return (
    <IntroWrapper
      title={
        plan
          ? formatMessage(messages.planTitle, {
              from: plan.periodFrom,
              to: plan.periodTo,
            })
          : formatMessage(coreMessages.equalityPlan)
      }
      intro={formatMessage(messages.planDetailIntro)}
      loading={loading}
      serviceProvider={{
        slug: JAFNRETTISSTOFA_SLUG,
        tooltip: formatMessage(coreMessages.equalityTooltip),
      }}
      buttonGroup={{
        actions: [
          <Button
            key="download"
            variant="ghost"
            size="small"
            icon="download"
            iconType="outline"
            disabled
          >
            {formatMessage(messages.downloadPlan)}
          </Button>,
        ],
      }}
    >
      {error && !loading ? (
        <Problem error={error} noBorder={false} />
      ) : !loading && !plan ? (
        <Problem type="not_found" noBorder={false} />
      ) : (
        <InfoLineStack label={messages.planInfo}>
          <InfoLine
            label={messages.identifier}
            content={plan?.identifier}
            loading={loading}
          />
          <InfoLine
            label={messages.status}
            content={
              plan ? getStatusTag(plan.status, formatMessage).label : undefined
            }
            loading={loading}
          />
          <InfoLine
            label={messages.submitted}
            content={formatDate(plan?.submittedAt)}
            loading={loading}
          />
          {(loading || plan?.approvedAt) && (
            <InfoLine
              label={messages.approved}
              content={formatDate(plan?.approvedAt)}
              loading={loading}
            />
          )}
          {(loading || plan?.validUntil) && (
            <InfoLine
              label={messages.validUntil}
              content={formatDate(plan?.validUntil)}
              loading={loading}
            />
          )}
          <InfoLine
            label={messages.company}
            content={
              plan
                ? formatMessage(messages.companyWithNationalId, {
                    name: plan.companyName,
                    nationalId: formatNationalId(plan.companyNationalId),
                  })
                : undefined
            }
            loading={loading}
          />
          {(loading || plan?.fileName) && (
            <InfoLine
              label={messages.document}
              content={plan?.fileName ?? undefined}
              loading={loading}
            />
          )}
        </InfoLineStack>
      )}
    </IntroWrapper>
  )
}

export default EqualityPlanDetail
