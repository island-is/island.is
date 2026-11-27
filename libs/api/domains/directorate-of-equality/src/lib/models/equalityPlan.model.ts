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
  identifier?: string

  @Field(() => Date, { nullable: true })
  submittedAt?: Date

  @Field(() => Date, { nullable: true })
  approvedAt?: Date

  @Field(() => Date, { nullable: true })
  validUntil?: Date

  @Field(() => [ReportCompany], { description: 'Parent company first' })
  companies!: ReportCompany[]

  @Field(() => String, { nullable: true })
  documentFileName?: string

  @Field(() => String, {
    nullable: true,
    description:
      'Download-service URL of the signed-off plan as a PDF; set only when the plan is approved or superseded',
  })
  pdfUrl?: string
}
