import { IsNationalId } from '@island.is/nest/validators'
import { ApiProperty } from '@nestjs/swagger'

export class FindByManagerDto {
  @ApiProperty()
  @IsNationalId()
  manager!: string
}
