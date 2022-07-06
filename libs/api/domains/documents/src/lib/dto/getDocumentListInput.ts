import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class GetDocumentListInput {
  @Field({ nullable: true })
  dateFrom?: Date

  @Field({ nullable: true })
  dateTo?: Date

  @Field({ nullable: true })
  categoryId?: string

  @Field({ nullable: true })
  typeId?: string

  @Field({ nullable: true })
  sortBy?: string

  @Field({ nullable: true })
  page?: number

  @Field({ nullable: true })
  pageSize?: number
}
