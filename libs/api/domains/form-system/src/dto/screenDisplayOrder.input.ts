import { Field, InputType } from "@nestjs/graphql";

@InputType('FormSystemScreenDisplayOrderInput')
export class ScreenDisplayOrderInput {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => String, { nullable: true })
  sectionId?: string
}
