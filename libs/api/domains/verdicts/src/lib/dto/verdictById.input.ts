import { Field, InputType } from '@nestjs/graphql'

@InputType('WebVerdictByIdInput')
export class VerdictByIdInput {
  @Field()
  id!: string
}
