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
  identifier?: string

  @Field(() => Date, { nullable: true })
  submittedAt?: Date

  @Field(() => Date, { nullable: true })
  approvedAt?: Date

  @Field(() => Date, { nullable: true })
  validUntil?: Date

  @Field(() => Date, {
    nullable: true,
    description:
      'Salary reports only: the first day of the payroll month, at UTC midnight',
  })
  salaryDataPeriod?: Date
}
