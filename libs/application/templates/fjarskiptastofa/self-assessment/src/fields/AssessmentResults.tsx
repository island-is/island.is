import { FC, ReactNode, useMemo } from 'react'
import { usePDF } from '@react-pdf/renderer'
import {
  AlertMessage,
  Box,
  Bullet,
  BulletList,
  Button,
  Table as T,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { SpiderChart } from '@island.is/application/ui-components'
import { FieldBaseProps } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import { m } from '../lib/messages'
import {
  getQuestionsData,
  getReferenceNumber,
  getSelfAssessmentResult,
} from '../utils/assessment'
import { AssessmentResultsPdf } from './AssessmentResultsPdf'

const formatScore = (score: number) =>
  Number.isInteger(score) ? String(score) : score.toFixed(1)

export const AssessmentResults: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()

  const result = getSelfAssessmentResult(application.externalData)
  const questionsData = getQuestionsData(application.externalData)
  const referenceNumber = getReferenceNumber(result)

  const companyName =
    getValueViaPath<string>(application.externalData, 'identity.data.name') ??
    ''

  // Map category id -> label so each score can be shown with its category name.
  const categoryLabels = useMemo(
    () =>
      new Map(
        (questionsData?.categories ?? []).map(
          (category) => [category.id, category.label] as const,
        ),
      ),
    [questionsData],
  )

  // One axis per category for the spider chart; the category label falls back to
  // its id if the questions data is missing a match.
  const chartData = useMemo(
    () =>
      (result?.categoryScores ?? []).map((categoryScore) => ({
        label:
          categoryLabels.get(categoryScore.categoryId) ??
          `#${categoryScore.categoryId}`,
        value: categoryScore.score,
      })),
    [result, categoryLabels],
  )

  // Generate the downloadable PDF of the submitted answers and results on the
  // client; it stays in sync with whatever the screen renders below.
  const [pdfInstance] = usePDF({
    document: (
      <AssessmentResultsPdf
        application={application}
        formatMessage={formatMessage}
      />
    ),
  })

  // The submit call may have failed or not returned scoring yet; the answers are
  // still safely submitted, so fall back to a gentle notice rather than nothing.
  if (!result) {
    return (
      <AlertMessage
        type="info"
        title={formatMessage(m.results.unavailableTitle)}
        message={formatMessage(m.results.unavailableMessage)}
      />
    )
  }

  return (
    <Box paddingBottom={7}>
      <Box
        display="flex"
        justifyContent="spaceBetween"
        alignItems="center"
        marginBottom={4}
      >
        <Text variant="h2" as="h1">
          {formatMessage(m.results.completedTitle)}
        </Text>
        {referenceNumber && (
          <Box textAlign="right">
            <Text variant="h5" color="dark400">
              {formatMessage(m.results.referenceNumber)}
            </Text>
            <Text variant="small">{referenceNumber}</Text>
          </Box>
        )}
      </Box>

      <AlertMessage
        type="success"
        title={formatMessage(m.results.successTitle)}
        message={formatMessage(m.results.successMessage, {
          companyName: (
            <Text as="span" fontWeight="semiBold" variant="small">
              {companyName}
            </Text>
          ),
        })}
      />
      <Box marginTop={4}>
        <Text variant="h3" marginBottom={2}>
          {formatMessage(m.results.title)}
        </Text>
        <Text variant="medium">{formatMessage(m.results.description)}</Text>
      </Box>
      {/* A polygon needs at least three axes to read as a spider chart; with
          fewer categories the score table below carries the result on its own. */}
      {chartData.length >= 3 && (
        <Box marginTop={2}>
          <SpiderChart
            data={chartData}
            domain={[0, 3]}
            tickCount={5}
            name={formatMessage(m.results.scoreColumn)}
            formatValue={formatScore}
            ariaLabel={formatMessage(m.results.title)}
            height={600}
            outerRadius="70%"
          />
        </Box>
      )}

      {result.categoryScores.length > 0 && (
        <Box marginY={4}>
          <T.Table>
            <T.Head>
              <T.Row>
                <T.HeadData>
                  {formatMessage(m.results.categoryColumn)}
                </T.HeadData>
                <T.HeadData>{formatMessage(m.results.scoreColumn)}</T.HeadData>
              </T.Row>
            </T.Head>
            <T.Body>
              {result.categoryScores.map((categoryScore) => (
                <T.Row key={categoryScore.categoryId}>
                  <T.Data>
                    {categoryLabels.get(categoryScore.categoryId) ??
                      `#${categoryScore.categoryId}`}
                  </T.Data>
                  <T.Data>{formatScore(categoryScore.score)}</T.Data>
                </T.Row>
              ))}
              {/* Overall score from the API, highlighted as a summary row.
                  The bottom border is removed so the table ends without a
                  trailing line under the last row. */}
              <T.Row>
                <T.Data style={{ borderBottom: 'none' }}>
                  <Text variant="small" fontWeight="semiBold">
                    {formatMessage(m.results.overallScoreLabel)}
                  </Text>
                </T.Data>
                <T.Data style={{ borderBottom: 'none' }}>
                  <Text variant="small" fontWeight="semiBold">
                    {formatScore(result.averageOverallScore)}
                  </Text>
                </T.Data>
              </T.Row>
            </T.Body>
          </T.Table>
        </Box>
      )}

      {result.scoreInterpretation && (
        <AlertMessage
          type="default"
          title={formatMessage(m.results.interpetationTitle)}
          message={result.scoreInterpretation}
        />
      )}

      <Box marginTop={5}>
        <Text variant="h3" as="h2" marginBottom={2}>
          {formatMessage(m.results.nextStepsTitle)}
        </Text>
        <BulletList type="ul" space={2}>
          <Bullet>{formatMessage(m.results.nextStepsBullet1)}</Bullet>
          <Bullet>{formatMessage(m.results.nextStepsBullet2)}</Bullet>
        </BulletList>
      </Box>

      <Box
        marginTop={5}
        padding={4}
        borderRadius="large"
        background="red100"
        display="flex"
        flexDirection={['column', 'row']}
        justifyContent="spaceBetween"
        alignItems={['flexStart', 'center']}
        rowGap={3}
        columnGap={3}
      >
        <Box>
          <Text variant="h4" as="h3" marginBottom={1}>
            {formatMessage(m.results.pdfTitle)}
          </Text>
          <Text variant="small">{formatMessage(m.results.pdfDescription)}</Text>
          <Text variant="small">
            {formatMessage(m.results.pdfDeletionWarning, {
              b: (chunks: ReactNode[]) => (
                <Text as="span" variant="small" fontWeight="semiBold">
                  {chunks}
                </Text>
              ),
            })}
          </Text>
        </Box>
        <a
          href={pdfInstance.url ?? undefined}
          download={formatMessage(m.results.pdfFileName)}
          style={{ textDecoration: 'none' }}
        >
          <Button
            as="span"
            icon="download"
            iconType="outline"
            loading={pdfInstance.loading}
            disabled={!pdfInstance.url || Boolean(pdfInstance.error)}
          >
            {formatMessage(m.results.pdfDownloadButton)}
          </Button>
        </a>
      </Box>
    </Box>
  )
}

export default AssessmentResults
