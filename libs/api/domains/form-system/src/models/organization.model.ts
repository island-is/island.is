import { Field, ID, ObjectType } from "@nestjs/graphql";
import { LanguageType } from "./global.model";
import { Input } from "./input.model";
import { ApplicantType } from "./applicantType.model";
import { ListType } from "./listType.model";
import { ExternalEndpoints } from "./externalEndpoints.model";
import { DocumentType } from "./documentType.model";
import { Form } from "./form.model";



@ObjectType('FormSystemOrganization')
export class Organization {
  @Field(() => ID, { nullable: true })
  id?: number

  @Field(() => LanguageType, { nullable: true })
  name?: LanguageType

  @Field(() => String, { nullable: true })
  nationalId?: string | null

  @Field(() => [Input], { nullable: true })
  inputTypes?: Input[] | null

  @Field(() => [DocumentType], { nullable: true })
  documentTypes?: DocumentType[] | null

  @Field(() => [ApplicantType], { nullable: true })
  applicantTypes?: ApplicantType[] | null

  @Field(() => [ListType], { nullable: true })
  listTypes?: ListType[] | null

  @Field(() => [Form], { nullable: true })
  forms?: Form[] | null

  @Field(() => [ExternalEndpoints], { nullable: true })
  externalEndpoints?: ExternalEndpoints[] | null
}

@ObjectType('FormSystemOrganizationCreation')
export class CreateOrganization {
  @Field(() => LanguageType, { nullable: true })
  name?: LanguageType

  @Field(() => String, { nullable: true })
  nationalId?: string
}
