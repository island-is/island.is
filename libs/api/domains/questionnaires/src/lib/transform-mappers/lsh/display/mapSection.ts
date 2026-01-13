import { Section } from '@island.is/clients/lsh'
import { QuestionnaireSection } from '../../../../models/questionnaire.model'
import { mapQuestion } from './mapQuestion'

export const mapSection = (section: Section): QuestionnaireSection => {
  return {
    title: section.caption || '',
    questions: Array.isArray(section.questions)
      ? section.questions.map(mapQuestion)
      : [],
  }
}
