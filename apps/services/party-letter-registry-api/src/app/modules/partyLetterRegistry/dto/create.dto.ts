import { IsArray, IsString, Length } from 'class-validator'
import { IsNationalId } from '@island.is/shared/nestjs'

export class CreateDto {
  @IsNationalId()
  owner!: string

  @Length(1, 2)
  partyLetter!: string

  @IsString()
  partyName!: string

  @IsArray()
  @IsNationalId({ each: true })
  managers!: string[]
}
