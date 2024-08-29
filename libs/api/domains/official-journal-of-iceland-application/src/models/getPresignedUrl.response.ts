import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('OfficialJournalOfIcelandApplicationGetPresignedUrlResponse')
export class GetPresignedUrlResponse {
  @Field(() => String)
  url!: string
}
