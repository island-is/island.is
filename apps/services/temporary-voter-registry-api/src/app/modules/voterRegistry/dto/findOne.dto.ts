import { IsNationalId } from '@island.is/shared/nestjs'
import { ApiProperty } from '@nestjs/swagger'

export class FindOneDto {
  @ApiProperty()
  @IsNationalId()
  nationalId!: string
}
