import { IsNationalId } from '@island.is/shared/nestjs'
import { ApiProperty } from '@nestjs/swagger'

export class FindByManagerDto {
  @ApiProperty()
  @IsNationalId()
  manager!: string
}
