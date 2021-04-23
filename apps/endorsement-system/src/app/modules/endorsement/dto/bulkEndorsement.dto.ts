import { IsString, IsArray } from 'class-validator'
import { IsNationalId } from '../validators/isNationalId.decorator'

export class BulkEndorsementDto {
  // TODO: Validate nationalId here
  @IsArray()
  @IsString({ each: true })
  @IsNationalId({ each: true })
  nationalIds!: string[]
}
