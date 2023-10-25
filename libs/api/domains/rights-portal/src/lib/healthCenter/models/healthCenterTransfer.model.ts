import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('RightsPortalHealthCenterRegisterResponse')
export class HealthCenterRegisterResponse {
  @Field(() => Boolean)
  success!: boolean
}
