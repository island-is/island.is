import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class HealthDirectorateWaitlistInput {
  @Field()
  id!: string
}
