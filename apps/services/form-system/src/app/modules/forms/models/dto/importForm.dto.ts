import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class ImportFormDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  organizationNationalId!: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Versioned form export JSON' })
  formJson!: string
}
