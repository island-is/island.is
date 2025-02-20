import { Field, InputType } from '@nestjs/graphql'

@InputType('FormSystemGetFormInput')
export class GetFormInput {
  @Field(() => String)
  id!: string
}
