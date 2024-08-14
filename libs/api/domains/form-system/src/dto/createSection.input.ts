import { Field, InputType } from "@nestjs/graphql";

@InputType('FormSystemCreateSectionInput')
export class CreateSectionInput {
  @Field(() => String, { nullable: true })
  formId?: string
}
