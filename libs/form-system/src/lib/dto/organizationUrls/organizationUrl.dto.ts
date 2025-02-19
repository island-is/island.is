import { Field, ObjectType } from '@nestjs/graphql'
import { ApiProperty } from '@nestjs/swagger'

@ObjectType('FormSystemOrganizationUrl')
export class OrganizationUrlDto {
  @ApiProperty()
  @Field(() => String)
  id!: string

  @ApiProperty()
  @Field(() => String)
  url!: string

  @ApiProperty()
  @Field(() => Boolean)
  isXroad!: boolean

  @ApiProperty()
  @Field(() => Boolean)
  isTest!: boolean

  @ApiProperty()
  @Field(() => String)
  type!: string

  @ApiProperty()
  @Field(() => String)
  method!: string
}
