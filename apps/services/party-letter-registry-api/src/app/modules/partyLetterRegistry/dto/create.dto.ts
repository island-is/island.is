import { IsArray, IsString, Length } from 'class-validator'
import { IsNationalId } from '@island.is/nest/validators'
import { ApiProperty } from '@nestjs/swagger'

export class CreateDto {
  @ApiProperty()
  @IsNationalId()
  owner!: string

  @ApiProperty()
  @Length(1, 2)
  partyLetter!: string

  @ApiProperty()
  @IsString()
  partyName!: string

  @ApiProperty()
  @IsArray()
  @IsNationalId({ each: true })
  managers!: string[]
}
