import { Field, ObjectType } from '@nestjs/graphql'
import { ApiProperty } from '@nestjs/swagger'

@ObjectType('FormSystemOrganizationFieldType')
export class OrganizationFieldTypeDto {
  @ApiProperty()
  @Field(() => String)
  id!: string

  @ApiProperty()
  @Field(() => String)
  fieldTypeId!: string
}
