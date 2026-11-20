import { useParams } from 'react-router-dom'

import { Button, toast } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  downloadLink,
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
import {
  useDirectorateOfEqualityEqualityPlanPdfLazyQuery,
  useDirectorateOfEqualityEqualityPlanQuery,
} from './EqualityPlanDetail.generated'

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
  const [getPdf, { loading: pdfLoading }] =
    useDirectorateOfEqualityEqualityPlanPdfLazyQuery({
      fetchPolicy: 'no-cache',
    })

  const onDownload = async () => {
    const { data: pdfData } = await getPdf({ variables: { input: { id } } })
    const content = pdfData?.directorateOfEqualityEqualityPlanPdf?.content
    if (!content) {
      toast.error(formatMessage(messages.downloadPlanError))
      return
    }
    downloadLink(
      content,
      'application/pdf',
      plan?.documentFileName ??
        `${plan?.identifier ?? formatMessage(messages.planTitleNoPeriod)}.pdf`,
    )
  }

  return (
    <IntroWrapper
      title={
        !plan
          ? formatMessage(coreMessages.equalityPlan)
          : from && to
          ? formatMessage(messages.planTitle, { from, to })
          : formatMessage(messages.planTitleNoPeriod)
      }
      intro={formatMessage(messages.planDetailIntro)}
      loading={loading}
      serviceProvider={{
        slug: JAFNRETTISSTOFA_SLUG,
        tooltip: formatMessage(coreMessages.equalityTooltip),
      }}
      buttonGroup={
        plan?.hasPdf
          ? {
              actions: [
                <Button
                  key="download"
                  variant="utility"
                  icon="download"
                  iconType="outline"
                  loading={pdfLoading}
                  onClick={onDownload}
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
