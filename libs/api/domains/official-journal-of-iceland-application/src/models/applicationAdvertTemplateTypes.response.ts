import { Field, ObjectType } from '@nestjs/graphql'
import { TemplateType } from './applicationAdvertTemplate.response'

@ObjectType('officialJournalOfIcelandApplicationAdvertTemplateTypesResponse')
export class OJOIApplicationAdvertTemplateTypesResponse {
  @Field(() => [TemplateType])
  types!: Array<TemplateType>
}
