import { Field, ObjectType } from '@nestjs/graphql'
import { Organization } from './organization.model'
import { Section } from './section.model'
import { LanguageType } from './languageType.model'

@ObjectType('FormSystemApplication')
export class Application {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => Organization, { nullable: true })
  organization?: Organization

  @Field(() => String, { nullable: true })
  formId?: string

  @Field(() => String, { nullable: true })
  slug?: string

  @Field(() => LanguageType, { nullable: true })
  formName?: LanguageType

  @Field(() => Date, { nullable: true })
  created?: Date

  @Field(() => Date, { nullable: true })
  modified?: Date

  @Field(() => [Section], { nullable: 'itemsAndList' })
  sections?: Section[]
}
