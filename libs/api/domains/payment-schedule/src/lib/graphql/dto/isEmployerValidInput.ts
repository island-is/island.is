import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class GetIsEmployerValidInput {
  @Field(() => String)
  companyId!: string
}
