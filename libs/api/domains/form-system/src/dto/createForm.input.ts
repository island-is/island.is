import { Field, InputType } from "@nestjs/graphql";

@InputType('FormSystemCreateFormInput')
export class CreateFormInput {
  @Field(() => String, { nullable: true })
  organizationId?: string
}
