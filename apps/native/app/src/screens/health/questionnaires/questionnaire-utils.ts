import {
  QuestionnaireQuestionnairesOrganizationEnum,
  QuestionnaireQuestionnairesStatusEnum,
} from '../../../graphql/types/schema'

export const getQuestionnaireStatusLabelId = (
  status?: QuestionnaireQuestionnairesStatusEnum | null,
) => {
  switch (status) {
    case QuestionnaireQuestionnairesStatusEnum.Answered:
      return 'health.questionnaires.status.answered'
    case QuestionnaireQuestionnairesStatusEnum.NotAnswered:
      return 'health.questionnaires.status.notAnswered'
    case QuestionnaireQuestionnairesStatusEnum.Draft:
      return 'health.questionnaires.status.draft'
    case QuestionnaireQuestionnairesStatusEnum.Expired:
      return 'health.questionnaires.status.expired'
    default:
      return 'health.questionnaires.status.unanswered'
  }
}

export const getQuestionnaireOrganizationLabelId = (
  organization?: QuestionnaireQuestionnairesOrganizationEnum | null,
) => {
  switch (organization) {
    case QuestionnaireQuestionnairesOrganizationEnum.El:
      return 'health.questionnaires.organization.el'
    case QuestionnaireQuestionnairesOrganizationEnum.Lsh:
      return 'health.questionnaires.organization.lsh'
    default:
      return 'health.questionnaires.organization.unknown'
  }
}
