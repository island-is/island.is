import { m } from '../lib/messages'
import { AssessmentAnswer } from './constants'

// Ordered worst-to-best to match Fjarskiptastofa's AnswerStatus scale.
export const assessmentOptions = [
  { value: AssessmentAnswer.NO, label: m.shared.answerNo },
  { value: AssessmentAnswer.IN_PROGRESS, label: m.shared.answerInProgress },
  { value: AssessmentAnswer.IN_ADOPTION, label: m.shared.answerInAdoption },
  { value: AssessmentAnswer.YES, label: m.shared.answerYes },
]
