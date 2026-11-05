import { useParams } from 'react-router-dom'

import { Box, Button, Text } from '@island.is/island-ui/core'
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
import { useDirectorateOfEqualityReportQuery } from '../../mocks/hooks'
import { AdjustedGap } from './components/AdjustedGap'
import { ImprovementPlan } from './components/ImprovementPlan'
import { MeanHourlyWage } from './components/MeanHourlyWage'
import { PayComponentsTable } from './components/PayComponentsTable'
import { WageDistribution } from './components/WageDistribution'

const ReportDetail = () => {
  useNamespaces(NAMESPACE)
  const { formatMessage } = useLocale()
  const { id } = useParams() as { id: string }
  const { data, loading, error } = useDirectorateOfEqualityReportQuery({
    variables: { input: { id } },
  })
  const report = data?.directorateOfEqualityReport

  return (
    <IntroWrapper
      title={
        report
          ? formatMessage(messages.reportTitle, { year: report.year })
          : formatMessage(coreMessages.equalityReport)
      }
      intro={formatMessage(messages.reportDetailIntro)}
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
            {formatMessage(messages.downloadReport)}
          </Button>,
        ],
      }}
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
              content={report?.identifier}
              loading={loading}
            />
            <InfoLine
              label={messages.status}
              content={
                report
                  ? getStatusTag(report.status, formatMessage).label
                  : undefined
              }
              loading={loading}
            />
            <InfoLine
              label={messages.submitted}
              content={formatDate(report?.submittedAt)}
              loading={loading}
            />
            {(loading || report?.approvedAt) && (
              <InfoLine
                label={messages.approved}
                content={formatDate(report?.approvedAt)}
                loading={loading}
              />
            )}
            <InfoLine
              label={messages.analysisPeriod}
              content={report?.analysisPeriod}
              loading={loading}
            />
            <InfoLine
              label={messages.company}
              content={
                report
                  ? formatMessage(messages.companyWithNationalId, {
                      name: report.companyName,
                      nationalId: formatNationalId(report.companyNationalId),
                    })
                  : undefined
              }
              loading={loading}
            />
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
              <Box marginBottom={8}>
                <PayComponentsTable data={report.payComponents} />
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
