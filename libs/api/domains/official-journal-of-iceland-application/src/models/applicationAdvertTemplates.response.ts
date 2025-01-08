import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('officialJournalOfIcelandApplicationAdvertTemplatesResponse')
export class OJOIApplicationAdvertTemplatesResponse {
  @Field(() => [String])
  templateTypes!: Array<string>
}
