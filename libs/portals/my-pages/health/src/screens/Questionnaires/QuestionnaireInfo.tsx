import {
  Box,
  Button,
  LoadingDots,
  Tag,
  TagVariant,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { useLocale } from '@island.is/localization'
import { Problem } from '@island.is/react-spa/shared'
import React from 'react'
import { useParams } from 'react-router-dom'
import { messages } from '../..'
import { useGetQuestionnaireQuery } from './questionnaires.generated'
import {
  formatDate,
  InfoLine,
  InfoLineStack,
  IntroWrapper,
  LinkButton,
} from '@island.is/portals/my-pages/core'
import { QuestionnaireQuestionnairesStatusEnum } from '@island.is/api/schema'
import { HealthPaths } from '../../lib/paths'
import { format } from 'path'

const QuestionnaireInfo: React.FC = () => {
  const { id } = useParams<{ id?: string }>()
  const { formatMessage, lang } = useLocale()

  const { data, loading, error } = useGetQuestionnaireQuery({
    variables: {
      id: id || '',
      locale: lang,
    },
    skip: !id,
  })

  if (!id) {
    return (
      <Box background="white">
        <Problem type="not_found" noBorder={false} />
      </Box>
    )
  }

  const questionnaire = data?.questionnairesDetail
  const status = questionnaire?.status
  const isAnswered = status === QuestionnaireQuestionnairesStatusEnum.answered
  const notAnswered =
    status === QuestionnaireQuestionnairesStatusEnum.notAnswered
  const isExpired = status === QuestionnaireQuestionnairesStatusEnum.expired

  const link = HealthPaths.HealthQuestionnairesAnswer.replace(':id', id)
  //  isAnswered
  //   ? HealthPaths.HealthQuestionnairesAnswered.replace(':id', id)
  //   : notAnswered
  //   ? HealthPaths.HealthQuestionnairesAnswer.replace(':id', id)
  //   : undefined

  const statusLabel = isAnswered
    ? formatMessage(messages.answeredQuestionnaire)
    : notAnswered
    ? formatMessage(messages.unAnsweredQuestionnaire)
    : isExpired
    ? formatMessage(messages.expiredQuestionnaire)
    : formatMessage(messages.unknown)

  const statusTagVariant: TagVariant = isAnswered
    ? 'blue'
    : notAnswered
    ? 'red'
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
          : questionnaire?.title ?? formatMessage(messages.questionnaire)
      }
      intro={formatMessage(messages.questionnairesIntro)}
      loading={loading}
      buttonGroup={
        link
          ? [
              <LinkButton
                key={'bloodtype-link'}
                variant="utility"
                colorScheme="primary"
                size="small"
                icon="open"
                to={link}
                text={
                  status &&
                  status === QuestionnaireQuestionnairesStatusEnum.answered
                    ? formatMessage(messages.seeAnswers)
                    : formatMessage(messages.answer)
                }
              />,
            ]
          : undefined
      }
    >
      {loading && !error && (
        <Box
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
          height="full"
        >
          <LoadingDots />
        </Box>
      )}
      {
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
                questionnaire?.organization ?? formatMessage(messages.unknown)
              }
            />,

            <InfoLine
              loading={loading}
              key="questionnaire-sent"
              label={formatMessage(messages.date)}
              content={
                questionnaire?.sentDate
                  ? formatDate(questionnaire?.sentDate)
                  : formatMessage(messages.unknown)
              }
            />,
          ]}
        ></InfoLineStack>
      }
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

export default QuestionnaireInfo
