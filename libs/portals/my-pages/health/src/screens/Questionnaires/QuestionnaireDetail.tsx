import {
  QuestionnaireQuestionnairesOrganizationEnum,
  QuestionnaireQuestionnairesStatusEnum,
} from '@island.is/api/schema'
import { Box, Button, Tag, TagVariant } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  formatDate,
  InfoLine,
  InfoLineStack,
  IntroWrapper,
  STAFRAEN_HEILSA_SLUG,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { FC } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { messages } from '../..'
import * as styles from './Questionnaires.css'
import { useGetQuestionnaireQuery } from './questionnaires.generated'
import { useHealthPlausibleSwap } from '../../utils/useHealthPlausibleSwap'
import { useTreatmentScopedPaths } from '../../utils/useTreatmentScopedPaths'

const QuestionnaireDetail: FC = () => {
  useNamespaces('sp.health')
  const { id, org } = useParams<{ id?: string; org?: string }>()

  useHealthPlausibleSwap()
  const { formatMessage, lang } = useLocale()
  const navigate = useNavigate()
  const paths = useTreatmentScopedPaths()

  const organization: QuestionnaireQuestionnairesOrganizationEnum | undefined =
    org === 'el'
      ? QuestionnaireQuestionnairesOrganizationEnum.EL
      : org === 'lsh'
      ? QuestionnaireQuestionnairesOrganizationEnum.LSH
      : undefined

  const { data, loading, error } = useGetQuestionnaireQuery({
    variables: {
      input: {
        id: id ?? '',
        organization:
          organization ?? QuestionnaireQuestionnairesOrganizationEnum.EL,
      },
      locale: lang,
    },
    fetchPolicy: 'network-only',
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

  const questionnaireParams = { org: organization.toLocaleLowerCase(), id }

  const answeredLink = latestSubmissionId
    ? paths.questionnaireAnswered({
        ...questionnaireParams,
        submissionId: latestSubmissionId,
      })
    : undefined

  const answerLink = paths.questionnaireAnswer(questionnaireParams)

  const hasSubmission =
    questionnaire?.submissions?.some((sub) => !sub.isDraft) ?? false

  const link =
    isAnswered || (isExpired && hasSubmission)
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
      serviceProvider={{
        slug: STAFRAEN_HEILSA_SLUG,
        tooltip: formatMessage(messages.stafraenHeilsaQuestionnairesTooltip),
      }}
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
      buttonGroup={{
        actions: [
          link ? (
            <Box
              key="answer-buttons"
              display="flex"
              flexWrap="wrap"
              columnGap={2}
              rowGap={2}
            >
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
              <Box className={styles.button} key={'answer-link-box'}>
                <Button
                  key={'answer-link'}
                  fluid
                  variant="utility"
                  colorScheme={link === answeredLink ? 'light' : 'primary'}
                  size="small"
                  onClick={() => navigate(link)}
                >
                  {link === answeredLink
                    ? formatMessage(messages.seeAnswers)
                    : isDraft
                    ? formatMessage(messages.continueDraftQuestionnaire)
                    : formatMessage(messages.answer)}
                </Button>
              </Box>
            </Box>
          ) : null,
          isDraft && answeredLink ? (
            <Box className={styles.button} key={'answer-link-draft-box'}>
              <Button
                key={'answer-link-draft'}
                fluid
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
        ],
      }}
      desktopContentSpan="10/12"
    >
      {questionnaire && !error && (
        <InfoLineStack space={[0, 0, 2]}>
          <InfoLine
            loading={loading}
            key="questionnaire-status"
            label={formatMessage(messages.status)}
            content={
              <Tag disabled outlined variant={statusTagVariant}>
                {statusLabel}
              </Tag>
            }
          />
          {questionnaire?.baseInformation.lastSubmitted && (
            <InfoLine
              loading={loading}
              key="questionnaire-answered-date"
              label={formatMessage(messages.answeredDate)}
              content={formatDate(questionnaire.baseInformation.lastSubmitted)}
            />
          )}
          <InfoLine
            loading={loading}
            key="questionnaire-organization"
            label={formatMessage(messages.organization)}
            content={
              questionnaire?.baseInformation.senderGroupName ??
              (questionnaire?.baseInformation.organization ===
              QuestionnaireQuestionnairesOrganizationEnum.EL
                ? formatMessage(messages.healthDirectorate)
                : formatMessage(messages.landspitali))
            }
          />
          <InfoLine
            loading={loading}
            key="questionnaire-sent"
            label={formatMessage(messages.questionnaireSentDate)}
            content={
              questionnaire?.baseInformation.sentDate
                ? formatDate(questionnaire?.baseInformation.sentDate)
                : formatMessage(messages.unknown)
            }
          />
          {questionnaire?.sender && (
            <InfoLine
              loading={loading}
              key="questionnaire-sender"
              label={formatMessage(messages.questionnaireSender)}
              content={questionnaire.sender}
            />
          )}
          {questionnaire?.expirationDate && (
            <InfoLine
              loading={loading}
              key="questionnaire-expiration"
              label={formatMessage(messages.questionnaireExpiration)}
              content={formatDate(questionnaire.expirationDate)}
            />
          )}
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
