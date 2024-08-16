import { Field, InputType } from "@nestjs/graphql";
import { ListItemDisplayOrderInput } from "./listItemDisplayOrder.input";

@InputType('FormSystemUpdateListItemsDisplayOrderInput')
export class UpdateListItemsDisplayOrderInput {
  @Field(() => [ListItemDisplayOrderInput], { nullable: true })
  listItemsDisplayOrderDto?: ListItemDisplayOrderInput[]
}
