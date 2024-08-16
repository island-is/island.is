import { Field, InputType } from "@nestjs/graphql";
import { SectionDisplayOrderInput } from "./sectionDisplayOrder.input";

@InputType('FormSystemUpdateSectionsDisplayOrderInput')
export class UpdateSectionsDisplayOrderInput {
  @Field(() => [SectionDisplayOrderInput], { nullable: true })
  sectionsDisplayOrderDto?: SectionDisplayOrderInput[]
}
