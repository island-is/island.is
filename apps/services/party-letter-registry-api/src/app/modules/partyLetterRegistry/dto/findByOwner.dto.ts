import { IsNationalId } from '@island.is/nest/validators'
import { ApiProperty } from '@nestjs/swagger'

export class FindByOwnerDto {
  @ApiProperty()
  @IsNationalId()
  owner!: string
}
