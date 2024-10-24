import { ApiProperty } from '@nestjs/swagger'
import { Sequelize } from 'sequelize'

export class ValueDto {
  @ApiProperty()
  id!: string

  @ApiProperty({ type: Sequelize.json })
  json?: object
}
