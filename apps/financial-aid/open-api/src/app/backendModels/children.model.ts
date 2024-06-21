import { Column, DataType, Model, Table } from 'sequelize-typescript'

import { ApiProperty } from '@nestjs/swagger'

import { ApplicationChildren } from '@island.is/financial-aid/shared/lib'

@Table({
  tableName: 'application_children',
  timestamps: true,
})
export class ChildrenBackendModel extends Model<ApplicationChildren> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  name!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  nationalId!: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  school?: string

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  @ApiProperty()
  livesWithApplicant!: boolean

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  @ApiProperty()
  livesWithBothParents!: boolean
}
