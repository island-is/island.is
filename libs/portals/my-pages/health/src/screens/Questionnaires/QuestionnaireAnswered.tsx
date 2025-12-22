import {
  QuestionnaireAnsweredQuestionnaire,
  QuestionnaireAnswerOptionType,
} from '@island.is/api/schema'
import {
  Box,
  Button,
  Inline,
  Select,
  SkeletonLoader,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  AnsweredQuestionnaire,
  formatDate,
  IntroWrapper,
  m,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { FC, useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { HealthPaths, messages } from '../..'
import * as styles from './Questionnaires.css'
import { useGetAnsweredQuestionnaireQuery } from './questionnaires.generated'

const QuestionnaireAnswered: FC = () => {
  const { id, org } = useParams<{
    id?: string
    org?: string
  }>()
  const location = useLocation()
  const navigate = useNavigate()
  const submissionId = location.state?.submissionId

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
      buttonGroupAlignment={'spaceBetween'}
      buttonGroup={[
        <Box>
          <Inline space={2} alignY={'bottom'}>
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
                value={{
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
            {isDraft ? (
              <Box className={styles.button}>
                <Button
                  fluid
                  key={'answer-link'}
                  variant="utility"
                  colorScheme="primary"
                  size="small"
                  onClick={() =>
                    navigate(link, {
                      state: { submissionId: currentSubmission?.id },
                    })
                  }
                >
                  {formatMessage(messages.continueDraftQuestionnaire)}
                </Button>
              </Box>
            ) : null}
          </Inline>
        </Box>,
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
        <Box marginTop={4}>
          <AnsweredQuestionnaire
            answers={currentSubmission?.answers?.map((answer) => ({
              questionId: answer.id,
              question: answer.label || '',
              answers: answer.values.map((value) => ({
                value,
              })),
              type: QuestionnaireAnswerOptionType.text,
            }))}
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
