import { getConfig } from '../config'

/**
 * Route definitions - change routes here for easy maintenance
 */
const ROUTES = {
  questionnaire: {
    base: '/minarsidur/heilsa/spurningalistar',
    actions: {
      answer: '/svara',
      viewAnswer: '/skoda-svor',
      continueDraft: '/svara',
    },
  },
} as const

/**
 * Questionnaire URL builder parameters
 */
export interface QuestionnaireUrlParams {
  organization: string
  id: string
  submissionId?: string
}

/**
 * Available questionnaire actions
 */
export type QuestionnaireAction = keyof typeof ROUTES.questionnaire.actions

/**
 * Builds questionnaire URLs with type safety
 */
export const buildQuestionnaireUrl = (
  params: QuestionnaireUrlParams,
  action: QuestionnaireAction,
): string => {
  const { organization, id, submissionId } = params
  const baseUrl = getConfig().baseUrl
  const route = ROUTES.questionnaire
  const actionPath = route.actions[action]

  let url = `${baseUrl}${route.base}/${organization.toLowerCase()}/${id}${actionPath}`
  
  if (submissionId) {
    url += `/${submissionId}`
  }

  return url
}

/**
 * Convenience methods for common questionnaire actions
 */
export const questionnaireUrls = {
  answer: (params: Omit<QuestionnaireUrlParams, 'submissionId'>) =>
    buildQuestionnaireUrl(params, 'answer'),
  
  viewAnswer: (params: QuestionnaireUrlParams) =>
    buildQuestionnaireUrl(params, 'viewAnswer'),
  
  continueDraft: (params: Omit<QuestionnaireUrlParams, 'submissionId'>) =>
    buildQuestionnaireUrl(params, 'continueDraft'),
}
