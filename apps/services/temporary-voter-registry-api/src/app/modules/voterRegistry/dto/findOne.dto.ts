import { IsNationalId } from '@island.is/nest/validators'
import { ApiProperty } from '@nestjs/swagger'

export class FindOneDto {
  @ApiProperty()
  @IsNationalId()
  nationalId!: string
}
