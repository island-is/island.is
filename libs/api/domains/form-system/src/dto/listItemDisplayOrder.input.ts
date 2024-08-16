import { Field, InputType } from "@nestjs/graphql";

@InputType('FormSystemListItemDisplayOrderInput')
export class ListItemDisplayOrderInput {
  @Field(() => String, { nullable: true })
  id?: string
}
