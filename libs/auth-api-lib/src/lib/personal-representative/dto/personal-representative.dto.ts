import {
  IsNotEmpty,
  IsString,
  IsDate,
  IsOptional,
  IsArray,
} from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { PersonalRepresentativeRightTypeDTO } from './personal-representative-right-type.dto'
import { PersonalRepresentative } from '../models/personal-representative.model'

export class PersonalRepresentativeDTO {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    example: 'guid',
  })
  readonly id?: string

  @IsString()
  @ApiProperty({
    example: 'personal_representative_for_disabled_person',
  })
  readonly personalRepresentativeTypeCode!: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '99',
    description:
      'contractId from personal representative contract system from personal representative contract system or other external system used to create personal rep contracts',
  })
  readonly contractId!: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'usernameA',
    description:
      'userId(AD) from personal representative contract system or other external system used to create personal rep contracts',
  })
  readonly externalUserId!: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '0123456789',
    description: 'nationalId of Personal Representative',
    pattern: '^d{10}$',
  })
  readonly nationalIdPersonalRepresentative!: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '0123456789',
    description: 'nationalId of Represented Person',
    pattern: '^d{10}$',
  })
  readonly nationalIdRepresentedPerson!: string

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  @ApiPropertyOptional({
    // add one day as validTo example
    example: new Date(new Date().setTime(new Date().getTime() + 86400000)), //86400000 = nr of ms in one day
  })
  readonly validTo?: Date

  @IsArray()
  @ApiProperty({
    example:
      '[{code:"health", description:"health descr", validFrom:"xx.yy.zzzz", validTo: "kk.dd.oooo"}, {code:"finance"}, description:"finance descr"}]',
    description:
      'A list of right typess that the personal representative has on behalf of represented person',
  })
  rights!: PersonalRepresentativeRightTypeDTO[]

  toModel(id: string): PersonalRepresentative {
    return {
      id: id,
      contractId: this.contractId,
      externalUserId: this.externalUserId,
      personalRepresentativeTypeCode: this.personalRepresentativeTypeCode,
      nationalIdPersonalRepresentative: this.nationalIdPersonalRepresentative,
      nationalIdRepresentedPerson: this.nationalIdRepresentedPerson,
      validTo: this.validTo,
    } as PersonalRepresentative
  }
}
