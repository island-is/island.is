import { Field, InputType } from '@nestjs/graphql'

@InputType('FormSystemDeleteFormApplicantTypeInput')
export class DeleteFormApplicantTypeInput {
  @Field(() => String)
  id!: string
}
