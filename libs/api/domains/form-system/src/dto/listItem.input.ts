import { Field, InputType, Int } from "@nestjs/graphql";
import { LanguageType } from "../models/LanguageType.model"


@InputType('FormSystemListItemInput')
export class ListItemInput {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => LanguageType, { nullable: true })
  label?: LanguageType

  @Field(() => LanguageType, { nullable: true })
  description?: LanguageType

  @Field(() => String, { nullable: true })
  value?: string

  @Field(() => Int, { nullable: true })
  displayOrder?: number

  @Field(() => Boolean, { nullable: true })
  isSelected?: boolean
}
