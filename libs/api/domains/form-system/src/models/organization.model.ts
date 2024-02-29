import { Field, ID, ObjectType } from "@nestjs/graphql";
import { LanguageType } from "./global.model";
import { Input } from "./input.model";
import { ApplicantType } from "./applicantType.model";
import { ListType } from "./listType.model";
import { ExternalEndpoints } from "./externalEndpoints.model";



@ObjectType('FormSystemOrganization')
export class Organization {
  @Field(() => ID, { nullable: true })
  id?: number

  @Field(() => LanguageType, { nullable: true })
  name?: LanguageType

  @Field(() => String, { nullable: true })
  nationalId?: string

  @Field(() => [Input], { nullable: true })
  inputTypes?: Input[]

  @Field(() => [DocumentType], { nullable: true })
  documentTypes?: DocumentType[]

  @Field(() => [ApplicantType], { nullable: true })
  applicantTypes?: ApplicantType[]

  @Field(() => [ListType], { nullable: true })
  listTypes?: ListType[]

  @Field(() => [Number], { nullable: true })
  forms?: number[]

  @Field(() => ExternalEndpoints, { nullable: true })
  externalEndpoints?: ExternalEndpoints
}

@ObjectType('FormSystemOrganizationCreation')
export class CreateOrganization {
  @Field(() => LanguageType, { nullable: true })
  name?: LanguageType

  @Field(() => String, { nullable: true })
  nationalId?: string
}
