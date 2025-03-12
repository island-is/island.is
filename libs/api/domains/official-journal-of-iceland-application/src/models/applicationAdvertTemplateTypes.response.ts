import { Field, ObjectType } from '@nestjs/graphql'
import { TemplateType } from './applicationAdvertTemplate.response'

@ObjectType('officialJournalOfIcelandApplicationAdvertTemplateTypesResponse')
export class OJOIApplicationAdvertTemplateTypesResponse {
  @Field(() => [OJOIApplicationAdvertTemplateType])
  types!: Array<OJOIApplicationAdvertTemplateType>
}

@ObjectType('officialJournalOfIcelandApplicationAdvertTemplateType')
export class OJOIApplicationAdvertTemplateType {
  @Field()
  title!: string

  @Field(() => TemplateType)
  type!: TemplateType
}
