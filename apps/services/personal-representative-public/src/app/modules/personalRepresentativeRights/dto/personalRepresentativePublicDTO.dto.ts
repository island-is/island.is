import { IsNotEmpty, IsString, IsArray, ArrayNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { PersonalRepresentativeDTO } from '@island.is/auth-api-lib/personal-representative'

export class PersonalRepresentativePublicDTO {
  @IsString()
  @ApiProperty({
    example: 'personal_representative_for_disabled_person',
  })
  personalRepresentativeTypeCode!: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '0123456789',
    description: 'nationalId of Personal Representative',
    pattern: '^d{10}$',
  })
  nationalIdPersonalRepresentative!: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '0123456789',
    description: 'nationalId of Represented Person',
    pattern: '^d{10}$',
  })
  nationalIdRepresentedPerson!: string

  @IsArray()
  @ArrayNotEmpty()
  @ApiProperty({
    example: '["health", "finance"]',
    description:
      'A list of right typess that the personal representative has on behalf of represented person',
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
