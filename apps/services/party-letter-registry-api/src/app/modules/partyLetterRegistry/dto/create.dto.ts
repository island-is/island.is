import { IsArray, IsString, Length } from 'class-validator'
import { IsNationalId } from '../validators/isNationalId.decorator'

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
