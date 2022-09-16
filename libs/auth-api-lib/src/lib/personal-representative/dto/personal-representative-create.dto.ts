import {
  IsNotEmpty,
  IsString,
  IsDateString,
  IsOptional,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class PersonalRepresentativeCreateDTO {
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

  @IsDateString()
  @IsOptional()
  @ApiPropertyOptional({
    // add one day as validTo example
    example: new Date(new Date().setTime(new Date().getTime() + 86400000)), //86400000 = nr of ms in one day
  })
  readonly validTo?: Date

  @IsArray()
  @ArrayNotEmpty()
  @ApiProperty({
    example: '["health", "finance"]',
    description:
      'A list of right typess that the personal representative has on behalf of represented person',
    minItems: 1,
  })
  readonly rightCodes!: string[]
}
