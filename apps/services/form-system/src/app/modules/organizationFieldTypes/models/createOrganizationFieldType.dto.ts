import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class CreateOrganizationFieldTypeDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  organizationId!: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  fieldTypeId!: string
}
