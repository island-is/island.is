import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class UpdateCurrentEmployerInput {
  @Field(() => String)
  employerNationalId!: string
}
