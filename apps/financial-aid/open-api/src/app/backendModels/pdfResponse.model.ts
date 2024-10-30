import { Column, DataType } from 'sequelize-typescript'

import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class PdfResponseBackendModel {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  file!: string
}
