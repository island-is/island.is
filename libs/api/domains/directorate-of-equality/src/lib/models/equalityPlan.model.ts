import { Field, ID, ObjectType } from '@nestjs/graphql'

import { DirectorateOfEqualitySubmissionStatus } from './enums'
import { ReportCompany } from './reportCompany.model'

@ObjectType('DirectorateOfEqualityEqualityPlan')
export class EqualityPlan {
  @Field(() => ID, {
    description: 'Same id as DirectorateOfEqualitySubmission.id',
  })
  id!: string

  @Field(() => DirectorateOfEqualitySubmissionStatus)
  status!: DirectorateOfEqualitySubmissionStatus

  @Field(() => String, { nullable: true })
  identifier?: string | null

  @Field(() => Date, { nullable: true })
  submittedAt?: Date | null

  @Field(() => Date, { nullable: true })
  approvedAt?: Date | null

  @Field(() => Date, { nullable: true })
  validUntil?: Date | null

  @Field(() => [ReportCompany], { description: 'Parent company first' })
  companies!: ReportCompany[]

  @Field(() => String, { nullable: true })
  documentFileName?: string | null

  @Field(() => Boolean, {
    description:
      'True when the plan was uploaded as a PDF and can be fetched with directorateOfEqualityEqualityPlanPdf; false when it was written in the editor',
  })
  hasPdf!: boolean
}
