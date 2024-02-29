import { Field, ObjectType } from "@nestjs/graphql";
import { Form } from "./form.model";
import { DocumentType } from "./documentType.model";
import { Input } from "./input.model";
import { ApplicantType } from "./applicantType.model";
import { ListType } from "./listType.model";
import { DocumentTypeDto } from '@island.is/clients/form-system'


@ObjectType('FormSystemFormResponse')
export class FormResponse {
  @Field(() => Form, { nullable: true })
  form?: Form

  @Field(() => [DocumentType], { nullable: true })
  documentTypes?: DocumentType[] | null

  @Field(() => [Input], { nullable: true })
  inputTypes?: Input[] | null

  @Field(() => [ApplicantType], { nullable: true })
  applicantTypes?: ApplicantType[] | null

  @Field(() => [ListType], { nullable: true })
  listTypes?: ListType[] | null
}
