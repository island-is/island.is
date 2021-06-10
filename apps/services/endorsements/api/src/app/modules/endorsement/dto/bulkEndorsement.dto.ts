import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsArray } from 'class-validator'
import { IsNationalId } from '@island.is/nest/validators'

export class BulkEndorsementDto {
  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  @IsNationalId({ each: true })
  nationalIds!: string[]
}
