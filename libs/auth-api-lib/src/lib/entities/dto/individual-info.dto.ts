import { ApiProperty } from '@nestjs/swagger'

export class IndividuaInfoDTO {
  @ApiProperty()
  name!: string
}
