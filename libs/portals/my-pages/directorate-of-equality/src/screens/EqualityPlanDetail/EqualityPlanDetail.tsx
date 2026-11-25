import { useParams } from 'react-router-dom'

import { Button } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  formatDate,
  formatNationalId,
  formSubmit,
  InfoLine,
  InfoLineStack,
  IntroWrapper,
  JAFNRETTISSTOFA_SLUG,
  m as coreMessages,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'

import { StatusTag } from '../../components/StatusTag/StatusTag'
import { NAMESPACE } from '../../lib/constants'
import { messages } from '../../lib/messages'
import { getStatusTag } from '../../lib/status'
import { useDirectorateOfEqualityEqualityPlanQuery } from './EqualityPlanDetail.generated'

const getYear = (date?: string | null) =>
  date ? new Date(date).getFullYear() : null

const EqualityPlanDetail = () => {
  useNamespaces(NAMESPACE)
  const { formatMessage } = useLocale()
  const { id } = useParams() as { id: string }
  const { data, loading, error } = useDirectorateOfEqualityEqualityPlanQuery({
    variables: { input: { id } },
  })
  const plan = data?.directorateOfEqualityEqualityPlan
  const from = getYear(plan?.approvedAt)
  const to = getYear(plan?.validUntil)
  const pdfUrl = plan?.pdfUrl
  const title = !plan
    ? formatMessage(coreMessages.equalityPlan)
    : from && to
    ? formatMessage(messages.planTitle, { from, to })
    : formatMessage(coreMessages.equalityPlan)

  return (
    <IntroWrapper
      desktopContentSpan="10/12"
      title={title}
      intro={formatMessage(messages.planDetailIntro)}
      loading={loading}
      serviceProvider={{
        slug: JAFNRETTISSTOFA_SLUG,
        tooltip: formatMessage(coreMessages.equalityTooltip),
      }}
      buttonGroup={
        pdfUrl
          ? {
              actions: [
                <Button
                  key="download"
                  variant="utility"
                  icon="download"
                  iconType="outline"
                  onClick={() => formSubmit(pdfUrl)}
                >
                  {formatMessage(messages.downloadPlan)}
                </Button>,
              ],
            }
          : undefined
      }
    >
      {error && !loading ? (
        <Problem error={error} noBorder={false} />
      ) : !loading && !plan ? (
        <Problem type="not_found" noBorder={false} />
      ) : (
        <InfoLineStack label={messages.planInfo}>
          <InfoLine
            label={messages.identifier}
            content={plan?.identifier ?? undefined}
            loading={loading}
          />
          {(loading || (plan && getStatusTag(plan.status, formatMessage))) && (
            <InfoLine
              label={coreMessages.status}
              content={plan ? <StatusTag status={plan.status} /> : undefined}
              loading={loading}
            />
          )}
          <InfoLine
            label={messages.submitted}
            content={formatDate(plan?.submittedAt)}
            loading={loading}
          />
          {(loading || plan?.approvedAt) && (
            <InfoLine
              label={coreMessages.approved}
              content={formatDate(plan?.approvedAt)}
              loading={loading}
            />
          )}
          {(loading || plan?.validUntil) && (
            <InfoLine
              label={coreMessages.validTo}
              content={formatDate(plan?.validUntil)}
              loading={loading}
            />
          )}
          {loading ? (
            <InfoLine label={messages.company} loading />
          ) : (
            plan?.companies.map((company) => (
              <InfoLine
                key={company.nationalId}
                label={messages.company}
                content={formatMessage(messages.companyWithNationalId, {
                  name: company.name,
                  nationalId: formatNationalId(company.nationalId),
                })}
              />
            ))
          )}
          {(loading || plan?.documentFileName) && (
            <InfoLine
              label={messages.document}
              content={plan?.documentFileName ?? undefined}
              loading={loading}
            />
          )}
        </InfoLineStack>
      )}
    </IntroWrapper>
  )
}

export default EqualityPlanDetail
