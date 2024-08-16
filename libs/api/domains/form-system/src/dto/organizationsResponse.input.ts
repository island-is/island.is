import { Field, InputType } from "@nestjs/graphql";
import { OrganizationInput } from "./organization.input";

@InputType('FormSystemOrganizationsResponseInput')
export class OrganizationResponseInput {
  @Field(() => [OrganizationInput], { nullable: true })
  organizations?: OrganizationInput[]
}
