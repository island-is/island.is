import {
  Column,
  CreatedAt,
  DataType,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'

import { ApiProperty } from '@nestjs/swagger'

import { Staff, StaffRole } from '@island.is/financial-aid/shared/lib'

@Table({
  tableName: 'staff',
  timestamps: true,
})
export class StaffModel extends Model<Staff> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  @ApiProperty()
  id: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  name: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  nationalId: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  municipalityId: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  municipalityName: string

  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: Object.values(StaffRole),
  })
  @ApiProperty()
  role: StaffRole

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  @ApiProperty()
  active: boolean

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  phoneNumber: string

  @CreatedAt
  @ApiProperty()
  created: Date

  @UpdatedAt
  @ApiProperty()
  modified: Date
}
