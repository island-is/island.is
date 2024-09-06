import { Field, ID, Int, ObjectType } from '@nestjs/graphql'
import { LanguageType } from './global.model'
import { Input } from './input.model'
import { ApplicantType } from './applicantType.model'
import { ListType } from './listType.model'
import { ExternalEndpoints } from './externalEndpoints.model'
import { DocumentType } from './documentType.model'
import { Form } from './form.model'

@ObjectType('FormSystemOrganization')
export class Organization {
  @Field(() => Int, { nullable: true })
  id?: number

  @Field(() => LanguageType, { nullable: true })
  name?: LanguageType

  @Field(() => String, { nullable: true })
  nationalId?: string | null

  @Field(() => [Input], { nullable: 'itemsAndList' })
  inputTypes?: Input[] | null

  @Field(() => [DocumentType], { nullable: 'itemsAndList' })
  documentTypes?: DocumentType[] | null

  @Field(() => [ApplicantType], { nullable: true })
  applicantTypes?: ApplicantType[] | null

  @Field(() => [ListType], { nullable: 'itemsAndList' })
  listTypes?: ListType[] | null

  @Field(() => [Form], { nullable: 'itemsAndList' })
  forms?: Form[] | null

  @Field(() => [ExternalEndpoints], { nullable: 'itemsAndList' })
  externalEndpoints?: ExternalEndpoints[] | null

  @Field(() => ID, { nullable: true })
  guid?: string
}
