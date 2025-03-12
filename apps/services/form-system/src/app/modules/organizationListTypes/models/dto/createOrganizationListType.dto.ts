import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class CreateOrganizationListTypeDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  organizationId!: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  listTypeId!: string
}
