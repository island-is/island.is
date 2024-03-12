import { Field, ID, ObjectType } from '@nestjs/graphql'
import { LanguageType } from './global.model'
import { Input } from './input.model'
import { ApplicantType } from './applicantType.model'
import { ListType } from './listType.model'
import { ExternalEndpoints } from './externalEndpoints.model'
import { DocumentType } from './documentType.model'
import { Form } from './form.model'

@ObjectType('FormSystemOrganization')
export class Organization {
  @Field(() => ID, { nullable: true })
  id?: number

  @Field(() => LanguageType, { nullable: true })
  name?: LanguageType

  @Field(() => String, { nullable: true })
  nationalId?: string | null

  @Field(() => [Input])
  inputTypes?: Input[] | null

  @Field(() => [DocumentType])
  documentTypes?: DocumentType[] | null

  @Field(() => [ApplicantType])
  applicantTypes?: ApplicantType[] | null

  @Field(() => [ListType])
  listTypes?: ListType[] | null

  @Field(() => [Form])
  forms?: Form[] | null

  @Field(() => [ExternalEndpoints])
  externalEndpoints?: ExternalEndpoints[] | null
}

@ObjectType('FormSystemOrganizationCreation')
export class CreateOrganization {
  @Field(() => LanguageType, { nullable: true })
  name?: LanguageType

  @Field(() => String, { nullable: true })
  nationalId?: string
}
