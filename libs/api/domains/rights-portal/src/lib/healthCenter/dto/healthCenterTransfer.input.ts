import { Field, InputType } from '@nestjs/graphql'

@InputType('RightsPortalHealthCenterTransferInput')
export class HealthCenterTransferInput {
  @Field(() => String)
  id!: string
}
