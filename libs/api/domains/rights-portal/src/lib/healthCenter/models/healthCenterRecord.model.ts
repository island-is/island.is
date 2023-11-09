import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('RightsPortalHealthCenterRecord')
export class HealthCenterRecord {
  @Field(() => Date, { nullable: true })
  dateFrom?: Date | null

  @Field(() => Date, { nullable: true })
  dateTo?: Date | null

  @Field(() => String, { nullable: true })
  healthCenterName?: string | null

  @Field(() => String, { nullable: true })
  doctor?: string | null
}
