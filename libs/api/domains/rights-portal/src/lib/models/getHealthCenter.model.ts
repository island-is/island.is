import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('RightsPortalHealthCenter')
export class HealthCenter {
  @Field(() => String, { nullable: true })
  name?: string | null

  @Field(() => String, { nullable: true })
  doctor?: string | null
}

@ObjectType('RightsPortalHealthCenterHistoryEntry')
export class HealthCenterHistoryEntry {
  @Field(() => Date, { nullable: true })
  dateFrom?: Date | null

  @Field(() => Date, { nullable: true })
  dateTo?: Date | null

  @Field(() => HealthCenter, { nullable: true })
  healthCenter?: HealthCenter
}

@ObjectType('RightsPortalHealthCenterHistory')
export class HealthCenterHistory {
  @Field(() => HealthCenter, { nullable: true })
  current?: HealthCenter

  @Field(() => [HealthCenterHistoryEntry], { nullable: true })
  history?: Array<HealthCenterHistoryEntry>
}
