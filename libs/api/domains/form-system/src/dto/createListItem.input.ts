import { Field, InputType, Int } from "@nestjs/graphql";

@InputType('FormSystemCreateListItemInput')
export class CreateListItemInput {
  @Field(() => String, { nullable: true })
  fieldId?: string

  @Field(() => Int, { nullable: true })
  displayOrder?: number
}
