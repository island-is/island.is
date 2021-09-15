import { Column, DataType, Model, Table } from 'sequelize-typescript'

import { ApiProperty } from '@nestjs/swagger'

import { Staff } from '@island.is/financial-aid/shared/lib'
import type { StaffRole } from '@island.is/financial-aid/shared/lib'

@Table
export class StaffModel extends Model<Staff> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  @ApiProperty()
  id: string

  @ApiProperty()
  name: string

  @ApiProperty()
  nationalId: string

  @ApiProperty()
  municipalityId: string

  @ApiProperty()
  role: StaffRole

  @ApiProperty()
  active: boolean

  @ApiProperty()
  phoneNumber: string
}
