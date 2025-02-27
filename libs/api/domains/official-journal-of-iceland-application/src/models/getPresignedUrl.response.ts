import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('OfficialJournalOfIcelandApplicationGetPresignedUrlResponse')
export class GetPresignedUrlResponse {
  @Field()
  url!: string

  @Field({ nullable: true })
  key?: string

  @Field({ nullable: true })
  cdn?: string
}
