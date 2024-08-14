import { Field, ID, Int, ObjectType } from '@nestjs/graphql'
import { LanguageType } from './OLDglobal.model'
import { Input } from './OLDinput.model'
import { ApplicantType } from './OLDapplicantType.model'
import { ListType } from './OLDlistType.model'
import { ExternalEndpoints } from './OLDexternalEndpoints.model'
import { DocumentType } from './OLDdocumentType.model'
import { Form } from './OLDform.model'

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
