import { IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateCaseDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly description: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly policeCaseNumber: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly suspectNationalId: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly suspectName: string
}
