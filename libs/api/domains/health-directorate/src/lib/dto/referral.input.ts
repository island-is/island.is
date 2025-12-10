import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class HealthDirectorateReferralInput {
  @Field()
  id!: string
}
