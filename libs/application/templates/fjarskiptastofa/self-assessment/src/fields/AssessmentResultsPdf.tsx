import { FC } from 'react'
import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer'
import { getValueViaPath } from '@island.is/application/core'
import { Application, FormatMessage } from '@island.is/application/types'
import { m } from '../lib/messages'
import {
  getAnswerLabel,
  getAssessmentAnswers,
  getQuestionsData,
  getReferenceNumber,
  getSelfAssessmentResult,
  groupQuestionsByCategory,
} from '../utils/assessment'
import { SUBMIT_EXTERNAL_DATA_ID } from '../utils/constants'
import { PdfSpiderChart } from './PdfSpiderChart'

const formatScore = (score: number) =>
  Number.isInteger(score) ? String(score) : score.toFixed(1)

const formatDate = (value?: string | number | Date) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${day}.${month}.${date.getFullYear()}`
}

interface AssessmentResultsPdfProps {
  application: Application
  formatMessage: FormatMessage
}

// Client-side PDF of the submitted self-assessment: the preliminary category
// scores plus every answer and its explanation, built from the same answers and
// external data the results screen renders.
export const AssessmentResultsPdf: FC<AssessmentResultsPdfProps> = ({
  application,
  formatMessage,
}) => {
  const result = getSelfAssessmentResult(application.externalData)
  const questionsData = getQuestionsData(application.externalData)
  const answers = getAssessmentAnswers(application.answers)

  const companyName =
    getValueViaPath<string>(application.externalData, 'identity.data.name') ??
    ''

  // The timestamp written when the submit api stored the scoring is the closest
  // thing to the submission date; fall back to the application's last change.
  const submissionDate = formatDate(
    getValueViaPath<string>(
      application.externalData,
      `${SUBMIT_EXTERNAL_DATA_ID}.date`,
    ) ?? application.modified,
  )

  const referenceNumber = getReferenceNumber(result)

  const categoryLabels = new Map(
    (questionsData?.categories ?? []).map(
      (category) => [category.id, category.label] as const,
    ),
  )

  // The spider axes use the short label where the API provides one, since the
  // full label rarely fits around a compact chart; the table below keeps the
  // full labels.
  const categoryShortLabels = new Map(
    (questionsData?.categories ?? []).map(
      (category) =>
        [category.id, category.shortLabel || category.label] as const,
    ),
  )

  // One axis per category, matching the on-screen spider chart.
  const chartData = (result?.categoryScores ?? []).map((categoryScore) => ({
    label:
      categoryShortLabels.get(categoryScore.categoryId) ??
      `#${categoryScore.categoryId}`,
    value: categoryScore.score,
  }))

  return (
    <Document>
      <Page size="A4" style={styles.body}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{formatMessage(m.application.name)}</Text>
          <View style={styles.meta}>
            <Text style={styles.metaLine}>
              {companyName
                ? `${formatMessage(m.results.title)} – ${companyName}`
                : formatMessage(m.results.title)}
            </Text>
            {referenceNumber ? (
              <Text style={styles.metaLine}>
                {`${formatMessage(
                  m.results.referenceNumber,
                )}: ${referenceNumber}`}
              </Text>
            ) : null}
            {submissionDate ? (
              <Text style={styles.metaLine}>
                {`${formatMessage(m.resultsPdf.dateLabel)}: ${submissionDate}`}
              </Text>
            ) : null}
          </View>
        </View>

        {/* Spider chart of the category scores */}
        {chartData.length >= 3 && (
          <View style={styles.chart}>
            <PdfSpiderChart data={chartData} domain={[0, 3]} tickCount={5} />
          </View>
        )}

        {/* Category scores */}
        {result && result.categoryScores.length > 0 && (
          <View style={styles.section}>
            <View style={styles.tableHeaderRow}>
              <Text style={[styles.cell, styles.cellGrow, styles.cellHeader]}>
                {formatMessage(m.results.categoryColumn)}
              </Text>
              <Text style={[styles.cell, styles.cellScore, styles.cellHeader]}>
                {formatMessage(m.results.scoreColumn)}
              </Text>
            </View>
            {result.categoryScores.map((categoryScore) => (
              <View key={categoryScore.categoryId} style={styles.tableRow}>
                <Text style={[styles.cell, styles.cellGrow]}>
                  {categoryLabels.get(categoryScore.categoryId) ??
                    `#${categoryScore.categoryId}`}
                </Text>
                <Text style={[styles.cell, styles.cellScore]}>
                  {formatScore(categoryScore.score)}
                </Text>
              </View>
            ))}
            <View style={styles.tableRow}>
              <Text style={[styles.cell, styles.cellGrow, styles.cellBold]}>
                {formatMessage(m.results.overallScoreLabel)}
              </Text>
              <Text style={[styles.cell, styles.cellScore, styles.cellBold]}>
                {formatScore(result.averageOverallScore)}
              </Text>
            </View>
          </View>
        )}

        {/* Submitted answers grouped by category, started on a fresh page */}
        {questionsData && (
          <View break style={styles.section}>
            <Text style={styles.sectionTitle}>
              {formatMessage(m.resultsPdf.answersSectionTitle)}
            </Text>
            {groupQuestionsByCategory(questionsData).map(
              ({ category, questions }) => {
                if (questions.length === 0) return null
                return (
                  <View key={category.id} style={styles.categoryBlock}>
                    <Text style={styles.categoryTitle}>{category.label}</Text>
                    {questions.map((question) => {
                      const answer = answers[`q${question.id}`]
                      const answerText = getAnswerLabel(answer?.answerValue)
                      return (
                        <View key={question.id} style={styles.question}>
                          <Text style={styles.questionText}>
                            {question.questionText}
                          </Text>
                          <Text style={styles.fieldLabel}>
                            {`${formatMessage(m.resultsPdf.answerColumn)}: `}
                            <Text style={styles.fieldValue}>
                              {answerText ? formatMessage(answerText) : '-'}
                            </Text>
                          </Text>
                          {answer?.remark ? (
                            <Text style={styles.fieldLabel}>
                              {`${formatMessage(m.resultsPdf.remarkColumn)}: `}
                              <Text style={styles.fieldValue}>
                                {answer.remark}
                              </Text>
                            </Text>
                          ) : null}
                        </View>
                      )
                    })}
                  </View>
                )
              },
            )}
          </View>
        )}
      </Page>
    </Document>
  )
}

const styles = StyleSheet.create({
  body: {
    paddingTop: 40,
    paddingBottom: 60,
    paddingHorizontal: 50,
    fontSize: 10,
    lineHeight: 1.4,
  },
  header: {
    marginBottom: 20,
  },
  institution: {
    fontSize: 11,
    color: '#595959',
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 600,
    marginBottom: 12,
  },
  meta: {
    marginTop: 6,
  },
  metaStrong: {
    fontSize: 12,
    fontWeight: 600,
    marginBottom: 2,
  },
  metaLine: {
    fontSize: 11,
    color: '#595959',
  },
  section: {
    marginBottom: 24,
  },
  chart: {
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 8,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    paddingBottom: 4,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    paddingVertical: 4,
  },
  cell: {
    paddingRight: 8,
  },
  cellGrow: {
    flexGrow: 1,
    flexBasis: 0,
  },
  cellScore: {
    width: 60,
    textAlign: 'right',
  },
  cellHeader: {
    fontWeight: 600,
  },
  cellBold: {
    fontWeight: 600,
  },
  categoryBlock: {
    marginBottom: 14,
  },
  categoryTitle: {
    fontSize: 12,
    fontWeight: 600,
    marginBottom: 6,
  },
  question: {
    marginBottom: 8,
  },
  questionText: {
    fontWeight: 600,
    marginBottom: 2,
  },
  fieldLabel: {
    color: '#595959',
  },
  fieldValue: {
    color: '#000000',
  },
})

export default AssessmentResultsPdf
