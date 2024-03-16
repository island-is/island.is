import { Column, DataType, Model, Table } from 'sequelize-typescript'

import { ApiProperty } from '@nestjs/swagger'

import { Staff } from '@island.is/financial-aid/shared/lib'

@Table({
  tableName: 'staff',
  timestamps: true,
})
export class StaffBackendModel extends Model<Staff> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  name!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  @ApiProperty()
  nationalId!: string
}
