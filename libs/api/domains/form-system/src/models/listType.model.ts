import { Field, ID, ObjectType } from "@nestjs/graphql";
import { LanguageType } from "./global.model";


ObjectType('FormSystemListType')
export class ListType {
  @Field(() => ID, { nullable: true })
  id?: number

  @Field(() => String, { nullable: true })
  type?: string

  @Field(() => LanguageType, { nullable: true })
  name?: LanguageType

  @Field(() => LanguageType, { nullable: true })
  description?: LanguageType
}
