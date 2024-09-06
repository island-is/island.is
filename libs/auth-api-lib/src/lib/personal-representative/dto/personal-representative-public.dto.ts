import { IsNotEmpty, IsString, IsArray } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { PersonalRepresentativeDTO } from './personal-representative.dto'

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
  @ApiProperty({
    example: '["health", "finance"]',
    description:
      'A list of right types that the personal representative has on behalf of represented person',
  })
  rights!: string[]

  @IsArray()
  @ApiProperty({
    example:
      '["PersonalRepresentative:health", "PersonalRepresentative:finance"]',
    description:
      'A list of delegation types that the personal representative has on behalf of represented person',
  })
  prDelegationTypeCodes!: string[]

  static fromDTO(
    dto: PersonalRepresentativeDTO,
  ): PersonalRepresentativePublicDTO {
    return {
      personalRepresentativeTypeCode: dto.personalRepresentativeTypeCode,
      nationalIdPersonalRepresentative: dto.nationalIdPersonalRepresentative,
      nationalIdRepresentedPerson: dto.nationalIdRepresentedPerson,
      rights: dto.rights.map((rc) => rc.code),
      prDelegationTypeCodes: dto.prDelegationTypes.map((dt) => dt.id),
    } as PersonalRepresentativePublicDTO
  }
}
