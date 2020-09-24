import { ApiProperty } from '@nestjs/swagger'

export class Version {
  @ApiProperty()
  version!: string
}
