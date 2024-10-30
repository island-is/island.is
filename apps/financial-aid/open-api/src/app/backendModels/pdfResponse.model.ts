import { Column, DataType, Model, Table } from 'sequelize-typescript'

import { ApiProperty } from '@nestjs/swagger'

import { Staff } from '@island.is/financial-aid/shared/lib'

@Table({
  tableName: 'pdfResponses',
  timestamps: false,
})
export class PdfResponseBackendModel extends Model<Staff> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  file!: string
}
