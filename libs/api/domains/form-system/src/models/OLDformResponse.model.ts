import { Field, ObjectType } from '@nestjs/graphql'
import { Form } from './OLDform.model'
import { DocumentType } from './OLDdocumentType.model'
import { Input } from './OLDinput.model'
import { ApplicantType } from './OLDapplicantType.model'
import { ListType } from './OLDlistType.model'

@ObjectType('FormSystemFormResponse')
export class FormResponse {
  @Field(() => Form, { nullable: true })
  form?: Form

  @Field(() => [DocumentType], { nullable: 'itemsAndList' })
  documentTypes?: DocumentType[] | null

  @Field(() => [Input], { nullable: 'itemsAndList' })
  inputTypes?: Input[] | null

  @Field(() => [ApplicantType], { nullable: 'itemsAndList' })
  applicantTypes?: ApplicantType[] | null

  @Field(() => [ListType], { nullable: 'itemsAndList' })
  listTypes?: ListType[] | null
}
