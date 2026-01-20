import {
  QuestionnaireQuestionnairesOrganizationEnum,
  QuestionnaireQuestionnairesStatusEnum,
} from '@island.is/api/schema'
import { Box, Button, Tag, TagVariant } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  formatDate,
  InfoLine,
  InfoLineStack,
  IntroWrapper,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { FC } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { messages } from '../..'
import { HealthPaths } from '../../lib/paths'
import * as styles from './Questionnaires.css'
import { useGetQuestionnaireQuery } from './questionnaires.generated'

const QuestionnaireDetail: FC = () => {
  const { id, org } = useParams<{ id?: string; org?: string }>()
  const { formatMessage, lang } = useLocale()
  const navigate = useNavigate()

  const organization: QuestionnaireQuestionnairesOrganizationEnum | undefined =
    org === 'el'
      ? QuestionnaireQuestionnairesOrganizationEnum.EL
      : org === 'lsh'
      ? QuestionnaireQuestionnairesOrganizationEnum.LSH
      : undefined

  const { data, loading, error } = useGetQuestionnaireQuery({
    variables: {
      input: { id: id ?? '', organization: organization },
      locale: lang,
    },
    skip: !id || !organization,
  })

  const questionnaire = data?.questionnairesDetail
  const status = questionnaire?.baseInformation.status
  const isAnswered = status === QuestionnaireQuestionnairesStatusEnum.answered
  const notAnswered =
    status === QuestionnaireQuestionnairesStatusEnum.notAnswered
  const isExpired = status === QuestionnaireQuestionnairesStatusEnum.expired
  const isDraft = status === QuestionnaireQuestionnairesStatusEnum.draft
  const canSubmit = questionnaire?.canSubmit ?? false
  const canSubmitAgain =
    canSubmit && (questionnaire?.submissions?.length ?? 0) > 0
  const latestSubmissionId = questionnaire?.baseInformation.lastSubmissionId

  if (!id || !organization) {
    return (
      <Box background="white">
        <Problem type="not_found" noBorder={false} />
      </Box>
    )
  }

  const answeredLink = HealthPaths.HealthQuestionnairesAnswered.replace(
    ':org',
    organization?.toLocaleLowerCase() ?? '',
  )
    .replace(':id', id)
    .replace(':submissionId', latestSubmissionId ?? '')

  const answerLink = HealthPaths.HealthQuestionnairesAnswer.replace(
    ':org',
    organization?.toLocaleLowerCase() ?? '',
  ).replace(':id', id)

  const link = isAnswered
    ? answeredLink
    : canSubmit && (notAnswered || isDraft)
    ? answerLink
    : undefined

  const statusLabel = isAnswered
    ? formatMessage(messages.answeredQuestionnaire)
    : notAnswered
    ? formatMessage(messages.unAnsweredQuestionnaire)
    : isExpired
    ? formatMessage(messages.expiredQuestionnaire)
    : isDraft
    ? formatMessage(messages.draftQuestionnaire)
    : formatMessage(messages.unknown)

  const statusTagVariant: TagVariant = isAnswered
    ? 'blue'
    : notAnswered || isDraft
    ? 'purple'
    : isExpired
    ? 'red'
    : 'mint'

  if (error && !loading) {
    return (
      <Box background="white">
        <Problem type="internal_service_error" noBorder={false} />
      </Box>
    )
  }

  return (
    <IntroWrapper
      title={
        loading
          ? formatMessage(messages.questionnaire)
          : questionnaire?.baseInformation.title ??
            formatMessage(messages.questionnaire)
      }
      intro={
        questionnaire?.baseInformation.description ??
        formatMessage(messages.questionnairesIntro)
      }
      loading={loading}
      buttonGroup={[
        link ? (
          <>
            <Box className={styles.button} key={'answer-link-box'}>
              <Button
                key={'answer-link'}
                fluid
                variant="utility"
                colorScheme={isAnswered ? 'light' : 'primary'}
                size="small"
                onClick={() => navigate(link)}
              >
                {isAnswered && !isExpired
                  ? formatMessage(messages.seeAnswers)
                  : isDraft
                  ? formatMessage(messages.continueDraftQuestionnaire)
                  : formatMessage(messages.answer)}
              </Button>
            </Box>
            {!isDraft && canSubmitAgain && (
              <Box className={styles.button} key={'answer-again-link-box'}>
                <Button
                  key={'answer-again-link'}
                  fluid
                  variant="utility"
                  colorScheme={'primary'}
                  size="small"
                  onClick={() => navigate(answerLink)}
                >
                  {formatMessage(messages.answerAgain)}
                </Button>
              </Box>
            )}
          </>
        ) : null,
        isDraft && answeredLink !== link ? (
          <Box className={styles.button} key={'answer-link-box'}>
            <Button
              fluid
              key={'answer-link'}
              variant="utility"
              colorScheme="light"
              size="small"
              onClick={() =>
                navigate(answeredLink, {
                  state: { submissionId: latestSubmissionId },
                })
              }
            >
              {formatMessage(messages.seeAnswers)}
            </Button>
          </Box>
        ) : null,
      ]}
    >
      {questionnaire && !error && (
        <InfoLineStack>
          <InfoLine
            loading={loading}
            key="questionnaire-status"
            label={formatMessage(messages.status)}
            content={
              <Tag disabled outlined={false} variant={statusTagVariant}>
                {statusLabel}
              </Tag>
            }
          />
          <InfoLine
            loading={loading}
            key="questionnaire-organization"
            label={formatMessage(messages.organization)}
            content={
              questionnaire?.baseInformation.organization ===
              QuestionnaireQuestionnairesOrganizationEnum.EL
                ? formatMessage(messages.healthDirectorate)
                : formatMessage(messages.landspitali)
            }
          />
          <InfoLine
            loading={loading}
            key="questionnaire-sent"
            label={formatMessage(messages.date)}
            content={
              questionnaire?.baseInformation.sentDate
                ? formatDate(questionnaire?.baseInformation.sentDate)
                : formatMessage(messages.unknown)
            }
          />
        </InfoLineStack>
      )}
      {!loading && !data?.questionnairesDetail && !error && (
        <Box background="white" margin={4} borderRadius="lg">
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

export default QuestionnaireDetail
