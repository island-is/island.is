import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('OfficialJournalOfIcelandApplicationGetPdfResponse')
export class GetPdfResponse {
  @Field()
  buffer!: Buffer
}
