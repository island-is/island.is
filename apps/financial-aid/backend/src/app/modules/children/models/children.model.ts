import {
  Column,
  CreatedAt,
  DataType,
  Model,
  Table,
  ForeignKey,
} from 'sequelize-typescript'

import { ApiProperty } from '@nestjs/swagger'

import { ApplicationModel } from '../../application/models/application.model'

import { ApplicationChildren } from '@island.is/financial-aid/shared/lib'

@Table({
  tableName: 'application_children',
  timestamps: true,
})
export class ChildrenModel extends Model<ApplicationChildren> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  @ApiProperty()
  id: string

  @CreatedAt
  @Column({
    type: DataType.DATE,
  })
  @ApiProperty()
  created: Date

  @ForeignKey(() => ApplicationModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @ApiProperty()
  applicationId: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  childName: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  childNationalId: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  school?: string
}
