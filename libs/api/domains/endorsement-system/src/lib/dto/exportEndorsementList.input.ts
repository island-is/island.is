import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class ExportEndorsementListInput {
  @Field()
  listId!: string

  @Field()
  fileType!: string
}
