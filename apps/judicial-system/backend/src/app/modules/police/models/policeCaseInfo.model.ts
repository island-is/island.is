import { ApiProperty } from '@nestjs/swagger'

export class PoliceCaseInfo {
  @ApiProperty()
  policeCaseNumber!: string
  @ApiProperty()
  place?: string
  @ApiProperty()
  date?: Date
}
