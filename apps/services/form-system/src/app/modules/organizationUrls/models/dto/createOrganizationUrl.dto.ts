import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class CreateOrganizationUrlDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  organizationId!: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  type!: string
}
