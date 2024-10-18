import { Field, ObjectType } from '@nestjs/graphql'
import { Form } from './form.model'
import { DocumentType } from './documentType.model'
import { Input } from './input.model'
import { ApplicantType } from './applicantType.model'
import { ListType } from './listType.model'

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
