import { Field, ID, ObjectType } from '@nestjs/graphql'

import {
  DirectorateOfEqualitySubmissionChannel,
  DirectorateOfEqualitySubmissionStatus,
  DirectorateOfEqualitySubmissionType,
} from './enums'

@ObjectType('DirectorateOfEqualitySubmission')
export class Submission {
  @Field(() => ID, {
    description:
      'DMR providerId — an application UUID, or `partner:…` / `system:…` for reports filed elsewhere',
  })
  id!: string

  @Field(() => DirectorateOfEqualitySubmissionType)
  type!: DirectorateOfEqualitySubmissionType

  @Field(() => DirectorateOfEqualitySubmissionStatus)
  status!: DirectorateOfEqualitySubmissionStatus

  @Field(() => DirectorateOfEqualitySubmissionChannel)
  submittedVia!: DirectorateOfEqualitySubmissionChannel

  @Field(() => String, { nullable: true })
  identifier?: string | null

  @Field(() => Date, { nullable: true })
  submittedAt?: Date | null

  @Field(() => Date, { nullable: true })
  approvedAt?: Date | null

  @Field(() => Date, { nullable: true })
  validUntil?: Date | null

  @Field(() => String, {
    nullable: true,
    description: 'Salary reports only: the payroll month, as YYYY-MM-01',
  })
  salaryDataPeriod?: string | null
}
