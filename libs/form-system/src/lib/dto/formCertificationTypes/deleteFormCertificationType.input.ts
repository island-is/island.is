import { Field, InputType } from '@nestjs/graphql'

@InputType('FormSystemDeleteFormCertificationTypeInput')
export class DeleteFormCertificationTypeInput {
  @Field(() => String)
  id!: string
}
