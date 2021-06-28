import { ApiProperty } from '@nestjs/swagger'

export class XlsxDto {
  @ApiProperty()
  headers!: Array<string>

  @ApiProperty()
  data!: Array<Array<string | number>>
}
