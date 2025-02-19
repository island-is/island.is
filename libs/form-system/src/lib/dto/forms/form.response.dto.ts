import { Field, ObjectType } from '@nestjs/graphql'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { FormDto } from './form.dto'
import {
  ApplicantType,
  CertificationType,
  FieldType,
  ListType,
} from '@island.is/form-system-dataTypes'
import { OrganizationUrlDto } from '../organizationUrls/organizationUrl.dto'

@ObjectType('FormSystemFormResponse')
export class FormResponseDto {
  @ApiPropertyOptional({ type: FormDto })
  @Field(() => FormDto, { nullable: true })
  form?: FormDto

  @ApiPropertyOptional({ type: [FieldType] })
  @Field(() => [FieldType], { nullable: 'itemsAndList' })
  fieldTypes?: FieldType[]

  @ApiPropertyOptional({ type: [CertificationType] })
  @Field(() => [CertificationType], { nullable: 'itemsAndList' })
  certificationTypes?: CertificationType[]

  @ApiPropertyOptional({ type: [ApplicantType] })
  @Field(() => [ApplicantType], { nullable: 'itemsAndList' })
  applicantTypes?: ApplicantType[]

  @ApiPropertyOptional({ type: [ListType] })
  @Field(() => [ListType], { nullable: 'itemsAndList' })
  listTypes?: ListType[]

  @ApiPropertyOptional({ type: [OrganizationUrlDto] })
  @Field(() => [OrganizationUrlDto], { nullable: 'itemsAndList' })
  urls?: OrganizationUrlDto[]

  @ApiPropertyOptional({ type: [FormDto] })
  @Field(() => [FormDto], { nullable: 'itemsAndList' })
  forms?: FormDto[]

  @ApiPropertyOptional({ type: [String] })
  @Field(() => [String], { nullable: 'itemsAndList' })
  organizationNationalIds?: string[]
}
