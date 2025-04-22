import { Field, ObjectType } from '@nestjs/graphql'

import { ServiceStatus } from '@island.is/judicial-system/types'

@ObjectType()
export class IndictmentCaseStatistics {
  @Field(() => Number)
  count!: number

  @Field(() => Number)
  averageRulingTimeMs!: number

  @Field(() => Number)
  averageRulingTimeDays!: number
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
}

@ObjectType()
export class CaseStatistics {
  @Field(() => Number)
  count!: number

  @Field(() => IndictmentCaseStatistics)
  indictmentCases!: IndictmentCaseStatistics

  @Field(() => SubpoenaStatistics)
  subpoenas!: SubpoenaStatistics
}
