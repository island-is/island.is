import { QuestionnaireAnsweredQuestionnaire } from '@island.is/api/schema'
import { Box, Button, Select, SkeletonLoader } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  AnsweredQuestionnaire,
  formatDate,
  IntroWrapper,
  LinkButton,
  m,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { HealthPaths, messages } from '../..'
import * as styles from './Questionnaires.css'
import { useGetAnsweredQuestionnaireQuery } from './questionnaires.generated'

const QuestionnaireAnswered: React.FC = () => {
  const { id, submissionId, org } = useParams<{
    id?: string
    submissionId?: string
    org?: string
  }>()
  const navigate = useNavigate()
  const { formatMessage, lang } = useLocale()
  const [currentSubmission, setCurrentSubmission] =
    useState<QuestionnaireAnsweredQuestionnaire>()

  const { data, loading, error } = useGetAnsweredQuestionnaireQuery({
    variables: {
      input: {
        id: id || '',
        submissionId: submissionId || '',
        organization: org || '',
      },
      locale: lang,
    },
    skip: !id,
  })

  const hasMoreThanOneSubmission =
    (data?.getAnsweredQuestionnaire?.data?.length || 0) > 1

  const isDraft = currentSubmission?.isDraft

  useEffect(() => {
    if (!hasMoreThanOneSubmission && data?.getAnsweredQuestionnaire?.data) {
      setCurrentSubmission(data?.getAnsweredQuestionnaire?.data[0])
    }
  }, [hasMoreThanOneSubmission, data?.getAnsweredQuestionnaire?.data])

  const handleSubmissionChange = (submissionId: string) => {
    const selectedSubmission = data?.getAnsweredQuestionnaire?.data?.find(
      (submission) => submission.id === submissionId,
    )
    setCurrentSubmission(selectedSubmission)
  }

  if (!id) {
    return (
      <Box background="white">
        <Problem type="not_found" noBorder={false} />
      </Box>
    )
  }

  const link = HealthPaths.HealthQuestionnairesAnswer.replace(
    ':org',
    org?.toLocaleLowerCase() ?? '',
  ).replace(':id', id)

  return (
    <IntroWrapper
      title={data?.getAnsweredQuestionnaire?.data[0]?.title || ''}
      intro={formatMessage(messages.answeredQuestionnaireAnswered)}
      loading={loading}
      buttonGroup={[
        hasMoreThanOneSubmission ? (
          <Box className={styles.select}>
            <Select
              options={data?.getAnsweredQuestionnaire?.data?.map(
                (submission) => ({
                  value: submission.id,
                  label: submission.date
                    ? formatMessage(messages.answeredAt, {
                        arg: formatDate(submission.date),
                      })
                    : formatMessage(messages.unknown),
                }),
              )}
              defaultValue={{
                label: currentSubmission?.date
                  ? formatMessage(messages.answeredAt, {
                      arg: formatDate(currentSubmission.date),
                    })
                  : formatMessage(messages.unknown),
                value: currentSubmission?.id || '',
              }}
              key="submission-select"
              onChange={(option) =>
                handleSubmissionChange(option?.value as string)
              }
              size="xs"
            />
          </Box>
        ) : null,
        isDraft ? (
          <LinkButton
            key={'answer-link'}
            variant="utility"
            colorScheme="primary"
            size="small"
            icon="open"
            to={link}
            text={formatMessage(messages.continueDraftQuestionnaire)}
          />
        ) : null,
        <Button
          variant="utility"
          onClick={() => window.print()}
          preTextIcon="print"
        >
          {formatMessage(m.print)}
        </Button>,
      ]}
    >
      {loading && !error && (
        <Box marginTop={6}>
          <SkeletonLoader height={24} width={'full'} repeat={8} space={4} />
        </Box>
      )}
      {error && !loading && (
        <Problem type="internal_service_error" noBorder error={error} />
      )}
      {data?.getAnsweredQuestionnaire && !loading && !error && (
        <Box>
          {/* Add your questionnaire display logic here */}
          <AnsweredQuestionnaire
            questionnaire={data.getAnsweredQuestionnaire?.data[0]}
          />
        </Box>
      )}
      {!loading && !data?.getAnsweredQuestionnaire && !error && (
        <Box background="white" marginTop={4} borderRadius="lg">
          <Problem
            type="not_found"
            noBorder={false}
            title={formatMessage(messages.questionnaireNotFound)}
            message={formatMessage(messages.questionnaireNotFoundDetail)}
          />
        </Box>
      )}
    </IntroWrapper>
  )
}

export default QuestionnaireAnswered
