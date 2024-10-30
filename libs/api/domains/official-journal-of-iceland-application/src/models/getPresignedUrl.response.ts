import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('OfficialJournalOfIcelandApplicationGetPresignedUrlResponse')
export class GetPresignedUrlResponse {
  @Field()
  url!: string
}
