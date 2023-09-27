import { ApiProperty } from '@nestjs/swagger'

export class AllFiles {
  @ApiProperty()
  success!: boolean
}
