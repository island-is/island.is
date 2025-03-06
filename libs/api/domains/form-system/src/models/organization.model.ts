import { Field, ObjectType } from '@nestjs/graphql'
import { LanguageType } from './languageType.model'
import { Form } from './form.model'
import { FormCertificationType } from './certification.model'
import { Option } from './option.model'

@ObjectType('FormSystemOrganization')
export class Organization {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => LanguageType, { nullable: true })
  name?: LanguageType

  @Field(() => String, { nullable: true })
  nationalId?: string

  @Field(() => [Form], { nullable: 'itemsAndList' })
  forms?: Form[]
}

@ObjectType('FormSystemOrganizationAdmin')
export class OrganizationAdmin {
  @Field(() => [String], { nullable: 'itemsAndList' })
  selectedCertificationTypes?: string[]

  @Field(() => [FormCertificationType], { nullable: 'itemsAndList' })
  certificationTypes?: FormCertificationType[]

  @Field(() => [Option], { nullable: 'itemsAndList' })
  organizations?: Option[]
}
