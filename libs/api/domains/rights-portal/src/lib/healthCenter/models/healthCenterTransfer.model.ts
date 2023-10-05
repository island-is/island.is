import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('RightsPortalHealthCenterTransferResponse')
export class HealthCenterTransferResponse {
  @Field(() => Boolean)
  success!: boolean
}
