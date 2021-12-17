import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { PersonalRepresentativeDTO } from '@island.is/auth-api-lib/personal-representative'

export class PersonalRepresentativePublicDTO {
  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'personal_representative_for_disabled_person',
  })
  personalRepresentativeTypeCode?: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'nationalId of Personal Representative',
  })
  nationalIdPersonalRepresentative!: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'nationalId of Represented Person',
  })
  nationalIdRepresentedPerson!: string

  @IsArray()
  @ArrayNotEmpty()
  @ApiProperty({
    example: '["health", "finance"]',
  })
  permissions!: string[]

  fromDTO(dto: PersonalRepresentativeDTO): PersonalRepresentativePublicDTO {
    this.personalRepresentativeTypeCode = dto.personalRepresentativeTypeCode
    this.nationalIdPersonalRepresentative = dto.nationalIdPersonalRepresentative
    this.nationalIdRepresentedPerson = dto.nationalIdRepresentedPerson
    this.permissions = dto.rights?.map((rc) => rc.code)
    return this
  }
}
