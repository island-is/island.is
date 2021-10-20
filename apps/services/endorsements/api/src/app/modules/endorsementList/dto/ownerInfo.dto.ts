import { ApiProperty } from '@nestjs/swagger'

export class OwnerInfoDto {
  @ApiProperty()
  fullName!: string
}
