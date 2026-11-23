import { useParams } from 'react-router-dom'

import { DirectorateOfEqualitySalaryDataBasis } from '@island.is/api/schema'
import { Box, Button, Text } from '@island.is/island-ui/core'
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
import { formatPeriodMonth, getPeriodYear } from '../../lib/format'
import { messages } from '../../lib/messages'
import { getStatusTag } from '../../lib/status'
import { AdjustedGap } from './components/AdjustedGap'
import { ImprovementPlan } from './components/ImprovementPlan'
import { MeanHourlyWage } from './components/MeanHourlyWage'
import { WageDistribution } from './components/WageDistribution'
import { useDirectorateOfEqualityReportQuery } from './ReportDetail.generated'

const ReportDetail = () => {
  useNamespaces(NAMESPACE)
  const { formatMessage, lang } = useLocale()
  const { id } = useParams() as { id: string }
  const { data, loading, error } = useDirectorateOfEqualityReportQuery({
    variables: { input: { id } },
  })
  const report = data?.directorateOfEqualityReport
  const year = getPeriodYear(report?.salaryDataPeriod)
  const analysisPeriod =
    report?.salaryDataBasis === DirectorateOfEqualitySalaryDataBasis.AVERAGE
      ? formatMessage(messages.analysisPeriodAverage)
      : report?.salaryDataPeriod
      ? formatPeriodMonth(report.salaryDataPeriod, lang)
      : undefined
  const title = !report
    ? formatMessage(coreMessages.equalityReport)
    : year
    ? formatMessage(messages.reportTitle, { year })
    : formatMessage(coreMessages.equalityReport)
  const pdfUrl = report?.pdfUrl
  const improvementPlanPdfUrl = report?.improvementPlanPdfUrl

  return (
    <IntroWrapper
      desktopContentSpan="10/12"
      title={title}
      intro={formatMessage(messages.reportDetailIntro)}
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
                  key="download-report"
                  variant="utility"
                  icon="download"
                  iconType="outline"
                  onClick={() => formSubmit(pdfUrl)}
                >
                  {formatMessage(messages.downloadReport)}
                </Button>,
                ...(improvementPlanPdfUrl
                  ? [
                      <Button
                        key="download-improvement-plan"
                        variant="utility"
                        icon="download"
                        iconType="outline"
                        onClick={() => formSubmit(improvementPlanPdfUrl)}
                      >
                        {formatMessage(messages.downloadImprovementPlan)}
                      </Button>,
                    ]
                  : []),
              ],
            }
          : undefined
      }
    >
      {error && !loading ? (
        <Problem error={error} noBorder={false} />
      ) : !loading && !report ? (
        <Problem type="not_found" noBorder={false} />
      ) : (
        <>
          <InfoLineStack label={messages.reportInfo}>
            <InfoLine
              label={messages.identifier}
              content={report?.identifier ?? undefined}
              loading={loading}
            />
            {(loading ||
              (report && getStatusTag(report.status, formatMessage))) && (
              <InfoLine
                label={coreMessages.status}
                content={
                  report ? <StatusTag status={report.status} /> : undefined
                }
                loading={loading}
              />
            )}
            <InfoLine
              label={messages.submitted}
              content={formatDate(report?.submittedAt)}
              loading={loading}
            />
            {(loading || report?.approvedAt) && (
              <InfoLine
                label={coreMessages.approved}
                content={formatDate(report?.approvedAt)}
                loading={loading}
              />
            )}
            {(loading || analysisPeriod) && (
              <InfoLine
                label={messages.analysisPeriod}
                content={analysisPeriod}
                loading={loading}
              />
            )}
            {loading ? (
              <InfoLine label={messages.company} loading />
            ) : (
              report?.companies.map((company) => (
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
          </InfoLineStack>
          {report && (
            <Box marginTop={8}>
              <Text variant="h3" as="h2" marginBottom={1}>
                {formatMessage(messages.resultsTitle)}
              </Text>
              <Text marginBottom={6}>
                {formatMessage(messages.resultsIntro)}
              </Text>
              <Box marginBottom={8}>
                <AdjustedGap gap={report.adjustedGap} />
              </Box>
              <Box marginBottom={8}>
                <MeanHourlyWage
                  wage={report.meanHourlyWage}
                  rawGap={report.rawGap}
                />
              </Box>
              <Box marginBottom={8}>
                <WageDistribution distribution={report.distribution} />
              </Box>
              {report.improvementPlan.length > 0 && (
                <Box marginBottom={8}>
                  <ImprovementPlan actions={report.improvementPlan} />
                </Box>
              )}
            </Box>
          )}
        </>
      )}
    </IntroWrapper>
  )
}

export default ReportDetail
