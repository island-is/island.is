import { Field, InputType } from "@nestjs/graphql";

@InputType('FormSystemSectionDisplayOrderInput')
export class SectionDisplayOrderInput {
  @Field(() => String, { nullable: true })
  id?: string
}
