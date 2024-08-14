import { Field, InputType } from "@nestjs/graphql";

@InputType('FormSystemCreateScreenInput')
export class CreateScreenInput {
  @Field(() => String, { nullable: true })
  sectionId?: string
}
