import { Field, InputType } from "@nestjs/graphql";
import { ScreenDisplayOrderInput } from "./screenDisplayOrder.input";

@InputType('FormSystemUpdateScreensDisplayOrderInput')
export class UpdateScreensDisplayOrderInput {
  @Field(() => [ScreenDisplayOrderInput], { nullable: true })
  screensDisplayOrderDto?: ScreenDisplayOrderInput[]
}
