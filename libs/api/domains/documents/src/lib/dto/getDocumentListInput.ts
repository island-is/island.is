import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class GetDocumentListInput {
  @Field({ nullable: true })
  senderKennitala?: string

  @Field({ nullable: true })
  dateFrom?: string

  @Field({ nullable: true })
  dateTo?: string

  @Field({ nullable: true })
  categoryId?: string

  @Field({ nullable: true })
  subjectContains?: string

  @Field({ nullable: true })
  typeId?: string

  @Field({ nullable: true })
  sortBy?: 'Date' | 'Category' | 'Type' | 'Subject' | 'Sender'

  @Field({ nullable: true })
  order?: 'Ascending' | 'Descending'

  @Field({ nullable: true })
  opened?: boolean

  @Field({ nullable: true })
  archived?: boolean

  @Field({ nullable: true })
  bookmarked?: boolean

  @Field({ nullable: true })
  page?: number

  @Field({ nullable: true })
  pageSize?: number

  @Field({ nullable: true, defaultValue: null })
  isLegalGuardian?: boolean
}
