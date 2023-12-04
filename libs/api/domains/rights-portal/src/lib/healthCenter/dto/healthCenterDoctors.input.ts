import { Field, InputType } from '@nestjs/graphql'

@InputType('RightsPortalHealthCenterDoctorsInput')
export class HealthCenterDoctorsInput {
  @Field(() => String)
  id!: string
}
