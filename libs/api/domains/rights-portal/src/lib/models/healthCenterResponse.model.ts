import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('RightsPortalHealthCenterResponse')
export class HealthCenterResponse {
  @Field(() => Boolean)
  success!: boolean
}
