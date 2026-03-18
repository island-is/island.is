import type { PrimarySchoolAssessmentType } from '../models/primarySchool/primarySchoolAssessmentType.model'

/**
 * Intersection type used to thread studentId through field resolvers on PrimarySchoolAssessmentType.
 * `studentId` is not a @Field — it's internal state passed via @Parent() to child resolvers.
 * Pattern mirrors national-registry's PersonV3 intersection type.
 */
export type PrimarySchoolAssessmentTypeWithContext =
  PrimarySchoolAssessmentType & {
    studentId: string
  }
