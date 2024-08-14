import { Field, InputType } from "@nestjs/graphql";

@InputType('FormSystemCreateFieldInput')
export class CreateFieldInput {
  @Field(() => String, { nullable: true })
  screenId?: string
}
