/* eslint-disable eqeqeq */
import {
  QuestionnaireQuestionnairesOrganizationEnum,
  QuestionnaireQuestionnairesStatusEnum,
  QuestionnaireSubmissionDetail,
} from '@island.is/api/schema'
import { Box, Tag, TagVariant } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  formatDate,
  InfoLine,
  InfoLineStack,
  IntroWrapper,
  LinkButton,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { FC } from 'react'
import { useParams } from 'react-router-dom'
import { messages } from '../..'
import { HealthPaths } from '../../lib/paths'
import { useGetQuestionnaireQuery } from './questionnaires.generated'

const QuestionnaireDetail: FC = () => {
  const { id, org } = useParams<{ id?: string; org?: string }>()
  const { formatMessage, lang } = useLocale()

  const organization: QuestionnaireQuestionnairesOrganizationEnum | undefined =
    org === 'el'
      ? QuestionnaireQuestionnairesOrganizationEnum.EL
      : org === 'lsh'
      ? QuestionnaireQuestionnairesOrganizationEnum.LSH
      : undefined

  const { data, loading, error } = useGetQuestionnaireQuery({
    variables: {
      input: { id: id || '', organization: organization },
      locale: lang,
    },
    skip: !id,
  })

  const questionnaire = data?.questionnairesDetail
  const status = questionnaire?.baseInformation.status
  const isAnswered = status == QuestionnaireQuestionnairesStatusEnum.answered
  const notAnswered =
    status == QuestionnaireQuestionnairesStatusEnum.notAnswered
  const isExpired = status === QuestionnaireQuestionnairesStatusEnum.expired
  const isDraft = status == QuestionnaireQuestionnairesStatusEnum.draft

  if (!id) {
    return (
      <Box background="white">
        <Problem type="not_found" noBorder={false} />
      </Box>
    )
  }

  const latestSubmission = questionnaire?.submissions?.reduce(
    (latest, current) =>
      !latest ||
      (current.lastUpdated && current.lastUpdated > (latest.lastUpdated || ''))
        ? current
        : latest,
    undefined as QuestionnaireSubmissionDetail | undefined,
  )

  const answerLink = HealthPaths.HealthQuestionnairesAnswered.replace(
    ':org',
    organization?.toLocaleLowerCase() ?? '',
  )
    .replace(':id', id)
    .replace(':submissionId', latestSubmission?.id ?? '')

  const link = isAnswered
    ? answerLink
    : notAnswered || isDraft
    ? HealthPaths.HealthQuestionnairesAnswer.replace(
        ':org',
        organization?.toLocaleLowerCase() ?? '',
      ).replace(':id', id)
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
          <LinkButton
            key={'answer-link'}
            variant="utility"
            colorScheme="primary"
            size="small"
            icon="open"
            to={link}
            text={
              isAnswered && !isExpired
                ? formatMessage(messages.seeAnswers)
                : isDraft
                ? formatMessage(messages.continueDraftQuestionnaire)
                : formatMessage(messages.answer)
            }
          />
        ) : null,
        isDraft && answerLink !== link ? (
          <LinkButton
            key={'answered-link'}
            variant="utility"
            colorScheme="light"
            size="small"
            icon="arrowForward"
            to={answerLink}
            text={formatMessage(messages.seeAnswers)}
          />
        ) : null,
      ]}
    >
      {questionnaire && !error && (
        <InfoLineStack
          children={[
            <InfoLine
              loading={loading}
              key="questionnaire-status"
              label={formatMessage(messages.status)}
              content={
                <Tag disabled outlined={false} variant={statusTagVariant}>
                  {statusLabel}
                </Tag>
              }
            />,

            <InfoLine
              loading={loading}
              key="questionnaire-organization"
              label={formatMessage(messages.organization)}
              content={
                questionnaire?.baseInformation.organization ===
                QuestionnaireQuestionnairesOrganizationEnum.EL
                  ? 'Embætti Landlæknis'
                  : 'Landspítali'
              }
            />,

            <InfoLine
              loading={loading}
              key="questionnaire-sent"
              label={formatMessage(messages.date)}
              content={
                questionnaire?.baseInformation.sentDate
                  ? formatDate(questionnaire?.baseInformation.sentDate)
                  : formatMessage(messages.unknown)
              }
            />,
          ]}
        ></InfoLineStack>
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
