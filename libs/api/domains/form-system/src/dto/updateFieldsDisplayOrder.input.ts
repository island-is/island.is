import { Field, InputType } from "@nestjs/graphql";
import { FieldDisplayOrderInput } from "./fieldDisplayOrder.input";

@InputType('FormSystemUpdateFieldsDisplayOrderInput')
export class UpdateFieldsDisplayOrderInput {
  @Field(() => [FieldDisplayOrderInput], { nullable: true })
  fieldsDisplayOrderDto?: FieldDisplayOrderInput[]
}
