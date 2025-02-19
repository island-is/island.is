import { Field, ObjectType } from '@nestjs/graphql'
import { ApiProperty } from '@nestjs/swagger'

@ObjectType('FormSystemOrganizationListType')
export class OrganizationListTypeDto {
  @ApiProperty()
  @Field(() => String)
  id!: string

  @ApiProperty()
  @Field(() => String)
  listTypeId!: string
}
