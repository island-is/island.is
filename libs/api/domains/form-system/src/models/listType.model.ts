import { Field, ID, Int, ObjectType } from '@nestjs/graphql'
import { LanguageType } from './global.model'

@ObjectType('FormSystemListType')
export class ListType {
  @Field(() => Int, { nullable: true })
  id?: number

  @Field(() => String, { nullable: true })
  type?: string | null

  @Field(() => LanguageType, { nullable: true })
  name?: LanguageType

  @Field(() => LanguageType, { nullable: true })
  description?: LanguageType

  @Field(() => ID, { nullable: true })
  guid?: string
}
