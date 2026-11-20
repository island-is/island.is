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

  @Field(() => Date, {
    nullable: true,
    description: 'The first day of the payroll month, at UTC midnight',
  })
  salaryDataPeriod?: Date | null

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

  @Field(() => Boolean, {
    description:
      'True when the report is approved or superseded and can be fetched with directorateOfEqualityReportPdf',
  })
  hasPdf!: boolean
}

export type ReportWithContext = Report & {
  includesImprovementPlan: boolean
}
