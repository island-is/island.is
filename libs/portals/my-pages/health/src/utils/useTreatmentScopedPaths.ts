import { generatePath, useParams } from 'react-router-dom'
import { HealthPaths } from '../lib/paths'

type QuestionnaireParams = { org: string; id: string }

/**
 * Conversation and questionnaire screens are shared between the global health
 * pages and a treatment's own pages. Under /heilsa/medferd/:treatmentId the
 * links stay inside the treatment so its breadcrumbs keep working.
 */
export const useTreatmentScopedPaths = () => {
  const { treatmentId } = useParams<{ treatmentId?: string }>()

  const build = (
    global: string,
    treatment: string,
    params: Record<string, string> = {},
  ) =>
    treatmentId
      ? generatePath(treatment, { ...params, treatmentId })
      : generatePath(global, params)

  return {
    treatmentId,
    conversations: build(
      HealthPaths.HealthConversations,
      HealthPaths.HealthTreatmentConversations,
    ),
    conversationsNew: build(
      HealthPaths.HealthConversationsNew,
      HealthPaths.HealthTreatmentConversationsNew,
    ),
    conversationDetail: (id: string) =>
      build(
        HealthPaths.HealthConversationsDetail,
        HealthPaths.HealthTreatmentConversationsDetail,
        { id },
      ),
    questionnaires: build(
      HealthPaths.HealthQuestionnaires,
      HealthPaths.HealthTreatmentQuestionnaires,
    ),
    questionnaireDetail: ({ org, id }: QuestionnaireParams) =>
      build(
        HealthPaths.HealthQuestionnairesDetail,
        HealthPaths.HealthTreatmentQuestionnairesDetail,
        { org, id },
      ),
    questionnaireAnswer: ({ org, id }: QuestionnaireParams) =>
      build(
        HealthPaths.HealthQuestionnairesAnswer,
        HealthPaths.HealthTreatmentQuestionnairesAnswer,
        { org, id },
      ),
    questionnaireAnswered: ({
      org,
      id,
      submissionId,
    }: QuestionnaireParams & { submissionId: string }) =>
      build(
        HealthPaths.HealthQuestionnairesAnswered,
        HealthPaths.HealthTreatmentQuestionnairesAnswered,
        { org, id, submissionId },
      ),
  }
}
