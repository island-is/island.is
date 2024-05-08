import { IsNotEmpty, IsString, IsUUID } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class PersonalRepresentativeDelegationTypeDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    example: '',
  })
  id!: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  delegationTypeId!: string

  @IsString()
  @IsNotEmpty()
  personalRepresentativeId!: string
}
