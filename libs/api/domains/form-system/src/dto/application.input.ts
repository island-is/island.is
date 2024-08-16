import { Field, InputType } from "@nestjs/graphql";
import { OrganizationInput } from "./organization.input";
import { SectionInput } from "./section.input";


@InputType('FormSystemApplicationInput')
export class ApplicationInput {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => OrganizationInput, { nullable: true })
  organization?: OrganizationInput

  @Field(() => String, { nullable: true })
  formId?: string

  @Field(() => String, { nullable: true })
  slug?: string

  @Field(() => Date, { nullable: true })
  created?: Date

  @Field(() => Date, { nullable: true })
  modified?: Date

  @Field(() => [SectionInput], { nullable: true })
  sections?: SectionInput[]
}
