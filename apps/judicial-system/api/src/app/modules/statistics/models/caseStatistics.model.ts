import { Field, ObjectType } from '@nestjs/graphql'

import { ServiceStatus } from '@island.is/judicial-system/types'

@ObjectType()
export class IndictmentCaseStatistics {
  @Field(() => Number)
  count!: number

  @Field(() => Number)
  inProgressCount!: number

  @Field(() => Number)
  rulingCount!: number

  @Field(() => Number)
  averageRulingTimeMs!: number

  @Field(() => Number)
  averageRulingTimeDays!: number

  @Field(() => String)
  minDate!: string
}

@ObjectType()
export class RequestCaseStatistics {
  @Field(() => Number)
  count!: number

  @Field(() => Number)
  inProgressCount!: number

  @Field(() => Number)
  completedCount!: number

  @Field(() => String)
  minDate!: string
}

@ObjectType()
export class ServiceStatusStatistics {
  @Field(() => ServiceStatus, { nullable: true })
  serviceStatus!: ServiceStatus | null

  @Field(() => Number)
  count!: number

  @Field(() => Number)
  averageServiceTimeMs!: number

  @Field(() => Number)
  averageServiceTimeDays!: number
}

@ObjectType()
export class SubpoenaStatistics {
  @Field(() => Number)
  count!: number

  @Field(() => [ServiceStatusStatistics])
  serviceStatusStatistics!: ServiceStatusStatistics[]

  @Field(() => String)
  minDate!: string
}

@ObjectType()
export class CaseStatistics {
  @Field(() => Number)
  count!: number

  @Field(() => RequestCaseStatistics)
  requestCases!: RequestCaseStatistics

  @Field(() => IndictmentCaseStatistics)
  indictmentCases!: IndictmentCaseStatistics

  @Field(() => SubpoenaStatistics)
  subpoenas!: SubpoenaStatistics
}
