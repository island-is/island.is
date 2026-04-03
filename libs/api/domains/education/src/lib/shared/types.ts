import type { PrimarySchoolAssessment } from '../models/primarySchool/primarySchoolAssessment.model'

/**
 * Intersection type used to thread studentId through field resolvers on PrimarySchoolAssessment.
 * `studentId` is not a @Field — it's internal state passed via @Parent() to child resolvers.
 */
export type PrimarySchoolAssessmentWithContext = PrimarySchoolAssessment & {
  studentId: string
}
