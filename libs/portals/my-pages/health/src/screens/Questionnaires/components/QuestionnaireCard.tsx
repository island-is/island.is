import {
  QuestionnaireQuestionnairesOrganizationEnum,
  QuestionnaireQuestionnairesStatusEnum as QuestionnairesStatusEnum,
  QuestionnairesBaseItem,
} from '@island.is/api/schema'
import { ActionCard } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { formatDate } from '@island.is/portals/my-pages/core'
import { useNavigate } from 'react-router-dom'
import { messages } from '../../../lib/messages'
import { useTreatmentScopedPaths } from '../../../utils/useTreatmentScopedPaths'

interface Props {
  questionnaire: Pick<
    QuestionnairesBaseItem,
    | 'id'
    | 'title'
    | 'description'
    | 'sentDate'
    | 'status'
    | 'organization'
    | 'senderGroupName'
  >
}

export const QuestionnaireCard = ({ questionnaire }: Props) => {
  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const paths = useTreatmentScopedPaths()

  const status = questionnaire.status
  const isAnswered = status === QuestionnairesStatusEnum.answered
  const isDraft = status === QuestionnairesStatusEnum.draft
  const isExpired = status === QuestionnairesStatusEnum.expired

  return (
    <ActionCard
      heading={questionnaire.title}
      headingVariant="h4"
      subText={questionnaire.description ?? ''}
      eyebrow={
        questionnaire.senderGroupName ??
        (questionnaire.organization ===
        QuestionnaireQuestionnairesOrganizationEnum.EL
          ? formatMessage(messages.healthDirectorate)
          : formatMessage(messages.landspitali))
      }
      eyebrowColor="purple400"
      text={formatDate(questionnaire.sentDate)}
      tag={{
        label: isAnswered
          ? formatMessage(messages.answeredQuestionnaire)
          : isExpired
          ? formatMessage(messages.expiredQuestionnaire)
          : isDraft
          ? formatMessage(messages.draftQuestionnaire)
          : formatMessage(messages.unAnsweredQuestionnaire),
        variant: isAnswered ? 'blue' : isExpired ? 'red' : 'purple',
      }}
      cta={{
        label: formatMessage(messages.questionnaireSeeMore),
        variant: 'text',
        icon: 'arrowForward',
        onClick: () =>
          navigate(
            paths.questionnaireDetail({
              org: questionnaire.organization?.toLocaleLowerCase() ?? '',
              id: questionnaire.id,
            }),
          ),
      }}
    />
  )
}

export default QuestionnaireCard
