import { Field, InputType } from "@nestjs/graphql";

@InputType('FormSystemFieldDisplayOrderInput')
export class FieldDisplayOrderInput {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => String, { nullable: true })
  screenId?: string
}
