/**
 * LSH Questionnaire Mapper - Transforms LSH Dev API Form objects into the internal Questionnaire format.
 */
import {
  Questionnaire as LshQuestionnaireType,
  QuestionnaireBody,
} from '@island.is/clients/lsh'
import { FormatMessage } from '@island.is/cms-translations'
import { Questionnaire } from '../../../../models/questionnaire.model'
import {
  QuestionnairesBaseItem,
  QuestionnairesOrganizationEnum,
  QuestionnairesStatusEnum,
} from '../../../../models/questionnaires.model'
import { m } from '../../../utils/messages'
import { mapSection } from './mapSection'

export const mapLshQuestionnaireForm = (
  form: QuestionnaireBody,
  formatMessage: FormatMessage,
): Questionnaire => {
  if (!form.gUID) {
    throw new Error(`LSH questionnaire is missing gUID`)
  }
  if (!form.formID) {
    throw new Error(`LSH questionnaire ${form.gUID} is missing formID`)
  }
  return {
    baseInformation: {
      id: form.gUID,
      formId: form.formID,
      title: form.header || formatMessage(m.questionnaireWithoutTitle),
      description: form.description || undefined,
      organization: QuestionnairesOrganizationEnum.LSH,
      sentDate: '',
    },
    sections: form.sections ? form.sections.map(mapSection) : [],
  }
}

export const mapLshQuestionnaireOverview = (
  data: LshQuestionnaireType,
  formatMessage: FormatMessage,
): Questionnaire => ({
  baseInformation: {
    id: data.gUID ?? 'undefined-id',
    title: data.caption || formatMessage(m.questionnaireWithoutTitle),
    status: data.answerDateTime
      ? QuestionnairesStatusEnum.answered
      : data.validToDateTime != null && data.validToDateTime < new Date()
      ? QuestionnairesStatusEnum.expired
      : QuestionnairesStatusEnum.notAnswered,
    sentDate: data.validFromDateTime?.toISOString() ?? '',
    description: data.description ?? undefined,
    organization: QuestionnairesOrganizationEnum.LSH,
    department: data.department ?? undefined,
  },
  expirationDate: data.validToDateTime ?? undefined,
  canSubmit:
    !data.answerDateTime &&
    (data.validToDateTime == null || data.validToDateTime >= new Date()),
})

export const mapLshQuestionnaireListItem = (
  data: LshQuestionnaireType,
  formatMessage: FormatMessage,
): QuestionnairesBaseItem => ({
  id: data.gUID ?? 'undefined-id',
  title: data.caption || formatMessage(m.questionnaireWithoutTitle),
  description: data.description ?? undefined,
  sentDate: data.validFromDateTime?.toISOString() ?? '',
  organization: QuestionnairesOrganizationEnum.LSH,
  department: data.department ?? undefined,
  status: data.answerDateTime
    ? QuestionnairesStatusEnum.answered
    : data.validToDateTime != null && data.validToDateTime < new Date()
    ? QuestionnairesStatusEnum.expired
    : QuestionnairesStatusEnum.notAnswered,
})
