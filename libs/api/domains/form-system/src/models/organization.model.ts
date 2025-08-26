import { Field, ObjectType } from '@nestjs/graphql'
import { LanguageType } from './languageType.model'
import { Form } from './form.model'

@ObjectType('FormSystemOrganization')
export class Organization {
  @Field(() => String)
  id!: string

  @Field(() => LanguageType, { nullable: true })
  name?: LanguageType

  @Field(() => String, { nullable: true })
  nationalId?: string

  @Field(() => [Form], { nullable: 'itemsAndList' })
  forms?: Form[]
}
