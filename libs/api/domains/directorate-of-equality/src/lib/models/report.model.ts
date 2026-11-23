import { Field, ID, ObjectType } from '@nestjs/graphql'

import { Distribution } from './distribution.model'
import {
  DirectorateOfEqualitySalaryDataBasis,
  DirectorateOfEqualitySubmissionStatus,
} from './enums'
import { AdjustedGap } from './adjustedGap.model'
import { Gap } from './gap.model'
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
  identifier?: string

  @Field(() => Date, { nullable: true })
  submittedAt?: Date

  @Field(() => Date, { nullable: true })
  approvedAt?: Date

  @Field(() => [ReportCompany], { description: 'Parent company first' })
  companies!: ReportCompany[]

  @Field(() => DirectorateOfEqualitySalaryDataBasis, { nullable: true })
  salaryDataBasis?: DirectorateOfEqualitySalaryDataBasis

  @Field(() => Date, {
    nullable: true,
    description: 'The first day of the payroll month, at UTC midnight',
  })
  salaryDataPeriod?: Date

  @Field(() => AdjustedGap, {
    nullable: true,
    description: 'Null when not computable',
  })
  adjustedGap?: AdjustedGap

  @Field(() => Gap, {
    nullable: true,
    description: 'Unadjusted gap on arithmetic means; null when not computable',
  })
  rawGap?: Gap

  @Field(() => MeanHourlyWage, { nullable: true })
  meanHourlyWage?: MeanHourlyWage

  @Field(() => Distribution, { nullable: true })
  distribution?: Distribution

  @Field(() => String, {
    nullable: true,
    description:
      'Download-service URL of the signed-off report as a PDF; set only when the report is approved or superseded',
  })
  pdfUrl?: string

  @Field(() => String, {
    nullable: true,
    description:
      'Download-service URL of the úrbótaáætlun as a PDF; set only when the report has a PDF and an improvement plan',
  })
  improvementPlanPdfUrl?: string
}

export type ReportWithContext = Report & {
  includesImprovementPlan: boolean
}
