import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'

export enum TemplateType {
  AUGLYSING,
  REGLUGERD,
  GJALDSKRA,
  UNKNOWN,
}

registerEnumType(TemplateType, {
  name: 'officialJournalOfIcelandApplicationAdvertTemplateTypeEnum',
})

@ObjectType('officialJournalOfIcelandApplicationAdvertTemplateResponse')
export class OJOIApplicationAdvertTemplateResponse {
  @Field()
  html!: string

  @Field(() => TemplateType)
  type!: TemplateType
}
