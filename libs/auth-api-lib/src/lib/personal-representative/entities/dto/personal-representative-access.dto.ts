import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional,IsString } from 'class-validator'

export class PersonalRepresentativeAccessDTO {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    example: 'guid',
  })
  readonly id?: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'serviceProvider',
  })
  readonly serviceProvider!: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'nationalId of Personal Representative',
  })
  readonly nationalIdPersonalRepresentative!: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'nationalId of Represented Person',
  })
  readonly nationalIdRepresentedPerson!: string
}
