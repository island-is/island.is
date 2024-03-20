import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class GetDocumentPageInput {
  @Field()
  pageSize!: number

  @Field()
  messageId!: string
}
