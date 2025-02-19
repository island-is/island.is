import { Field, InputType } from '@nestjs/graphql'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

@InputType('FormSystemCreateOrganizationListTypeInput')
export class CreateOrganizationListTypeDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  @Field(() => String)
  organizationId!: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  @Field(() => String)
  listTypeId!: string
}
