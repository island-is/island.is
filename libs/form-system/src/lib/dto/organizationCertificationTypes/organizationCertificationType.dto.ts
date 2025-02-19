import { Field, ObjectType } from '@nestjs/graphql'
import { ApiProperty } from '@nestjs/swagger'

@ObjectType('FormSystemOrganizationCertificationType')
export class OrganizationCertificationTypeDto {
  @ApiProperty()
  @Field(() => String)
  id!: string

  @ApiProperty()
  @Field(() => String)
  certificationTypeId!: string
}
