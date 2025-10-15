import { ApiProperty } from '@nestjs/swagger'
import { LanguageType } from '../../../../dataTypes/languageType.model'
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

export class CreateOrganizationDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  nationalId!: string
}
