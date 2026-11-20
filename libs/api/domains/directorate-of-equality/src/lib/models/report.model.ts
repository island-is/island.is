import { Field, ID, ObjectType } from '@nestjs/graphql'

import { Distribution } from './distribution.model'
import {
  DirectorateOfEqualitySalaryDataBasis,
  DirectorateOfEqualitySubmissionStatus,
} from './enums'
import { AdjustedGap, Gap } from './gap.model'
import { MeanHourlyWage } from './meanHourlyWage.model'
import { ReportCompany } from './reportCompany.model'

@ObjectType('DirectorateOfEqualityReport')
export class Report {
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

  @Field(() => [ReportCompany], { description: 'Parent company first' })
  companies!: ReportCompany[]

  @Field(() => DirectorateOfEqualitySalaryDataBasis, { nullable: true })
  salaryDataBasis?: DirectorateOfEqualitySalaryDataBasis | null

  @Field(() => String, {
    nullable: true,
    description: 'The payroll month, as YYYY-MM-01',
  })
  salaryDataPeriod?: string | null

  @Field(() => AdjustedGap, {
    nullable: true,
    description: 'Null when not computable',
  })
  adjustedGap?: AdjustedGap | null

  @Field(() => Gap, {
    nullable: true,
    description: 'Unadjusted gap on arithmetic means; null when not computable',
  })
  rawGap?: Gap | null

  @Field(() => MeanHourlyWage, { nullable: true })
  meanHourlyWage?: MeanHourlyWage | null

  @Field(() => Distribution, { nullable: true })
  distribution?: Distribution | null
}

export type ReportWithContext = Report & {
  includesImprovementPlan: boolean
}
