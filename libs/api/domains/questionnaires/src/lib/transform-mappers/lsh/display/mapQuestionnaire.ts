/**
 * LSH Questionnaire Mapper - Transforms LSH Dev API Form objects into the internal Questionnaire format.
 */
import { QuestionnaireBody } from '@island.is/clients/lsh'
import { Questionnaire } from '../../../../models/questionnaire.model'
import { QuestionnairesOrganizationEnum } from '../../../../models/questionnaires.model'
import { mapSection } from './mapSection'

export const mapLshQuestionnaire = (form: QuestionnaireBody): Questionnaire => {
  const data = {
    baseInformation: {
      id: form.gUID || 'undefined-id',
      formId: form.formID || 'undefined-form-id',
      title: form.header || '',
      description: form.description || undefined,
      organization: QuestionnairesOrganizationEnum.LSH,
      sentDate: '',
    },
    sections: form.sections ? form.sections.map(mapSection) : [],
  }
  return data
}
