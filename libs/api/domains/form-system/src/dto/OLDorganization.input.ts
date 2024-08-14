import { Field, Int, InputType, ID } from '@nestjs/graphql'
import { InputInput } from './OLDinputs.input'
import { DocumentTypeInput } from './OLDdocumentType.input'
import { FormInput } from './OLDforms.input'
import { ApplicantTypeInput } from './applicantType.input'
import { ListTypeInput } from './OLDlistType.input'
// import { ExternalEndpointsInput } from './externalEndpoints.input'
import { LanguageTypeInput } from './OLDlanguage.input'

@InputType('FormSystemOrganizationCreation')
export class CreateOrganization {
  @Field(() => LanguageTypeInput, { nullable: true })
  name?: LanguageTypeInput

  @Field(() => String, { nullable: true })
  nationalId?: string
}

@InputType('FormSystemCreateOrganizationInput')
export class CreateOrganizationInput {
  @Field(() => LanguageTypeInput, { nullable: true })
  name?: LanguageTypeInput

  @Field(() => String, { nullable: true })
  nationalId?: string
}

@InputType('FormSystemOrganizationInput')
export class OrganizationInput {
  @Field(() => Int, { nullable: true })
  id?: number

  @Field(() => LanguageTypeInput, { nullable: true })
  name?: LanguageTypeInput

  @Field(() => String, { nullable: true })
  nationalId?: string | null

  @Field(() => [InputInput], { nullable: 'itemsAndList' })
  inputTypes?: InputInput[] | null

  @Field(() => [DocumentTypeInput], { nullable: 'itemsAndList' })
  documentTypes?: DocumentTypeInput[] | null

  @Field(() => [ApplicantTypeInput], { nullable: true })
  applicantTypes?: ApplicantTypeInput[] | null

  @Field(() => [ListTypeInput], { nullable: 'itemsAndList' })
  listTypes?: ListTypeInput[] | null

  @Field(() => [FormInput], { nullable: 'itemsAndList' })
  forms?: FormInput[] | null

  // @Field(() => [ExternalEndpointsInput], { nullable: 'itemsAndList' })
  // externalEndpoints?: ExternalEndpointsInput[] | null

  @Field(() => ID, { nullable: true })
  guid?: string
}
