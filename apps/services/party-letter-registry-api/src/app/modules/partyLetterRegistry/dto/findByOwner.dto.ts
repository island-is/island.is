import { IsNationalId } from '@island.is/shared/nestjs'
import { ApiProperty } from '@nestjs/swagger'

export class FindByOwnerDto {
  @ApiProperty()
  @IsNationalId()
  owner!: string
}
