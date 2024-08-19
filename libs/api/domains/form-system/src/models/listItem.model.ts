import { Field, ObjectType } from "@nestjs/graphql";
import { LanguageType } from "./LanguageType.model";


@ObjectType('FormSystemListType')
export class ListType {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => LanguageType, { nullable: true })
  name?: LanguageType

  @Field(() => LanguageType, { nullable: true })
  description?: LanguageType

  @Field(() => String, { nullable: true })
  type?: string

  @Field(() => Boolean, { nullable: true })
  isCommon?: boolean
}
