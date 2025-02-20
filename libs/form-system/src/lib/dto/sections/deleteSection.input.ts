import { Field, InputType } from '@nestjs/graphql'

@InputType('FormSystemDeleteSectionInput')
export class DeleteSectionInput {
  @Field(() => String)
  id!: string
}
