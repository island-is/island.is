import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsArray } from 'class-validator'
import { IsNationalId } from '../validators/isNationalId.decorator'

export class BulkEndorsementDto {
  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  @IsNationalId({ each: true })
  nationalIds!: string[]
}
