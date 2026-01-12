import { Field, ObjectType } from '@nestjs/graphql'
import { LanguageType } from './languageType.model'
import { Option } from './option.model'

@ObjectType('FormSystemPermissionType')
export class PermissionType {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => LanguageType, { nullable: true })
  name?: LanguageType

  @Field(() => LanguageType, { nullable: true })
  description?: LanguageType

  @Field(() => Boolean, { nullable: true })
  isCommon?: boolean
}

@ObjectType('FormSystemOrganizationAdmin')
export class OrganizationAdmin {
  @Field(() => String, { nullable: true })
  organizationId?: string

  @Field(() => [String], { nullable: 'itemsAndList' })
  selectedCertificationTypes?: string[]

  @Field(() => [String], { nullable: 'itemsAndList' })
  selectedListTypes?: string[]

  @Field(() => [String], { nullable: 'itemsAndList' })
  selectedFieldTypes?: string[]

  @Field(() => [PermissionType], { nullable: 'itemsAndList' })
  certificationTypes?: PermissionType[]

  @Field(() => [PermissionType], { nullable: 'itemsAndList' })
  listTypes?: PermissionType[]

  @Field(() => [PermissionType], { nullable: 'itemsAndList' })
  fieldTypes?: PermissionType[]

  @Field(() => [Option], { nullable: 'itemsAndList' })
  organizations?: Option[]
}
