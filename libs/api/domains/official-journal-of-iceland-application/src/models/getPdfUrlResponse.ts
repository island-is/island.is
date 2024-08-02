import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('OfficialJournalOfIcelandApplicationGetPdfUrlResponse')
export class GetPdfUrlResponse {
  @Field(() => String)
  url!: string
}
