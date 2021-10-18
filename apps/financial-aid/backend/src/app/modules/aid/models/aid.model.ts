import {
  Column,
  CreatedAt,
  DataType,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'

import { ApiProperty } from '@nestjs/swagger'
import { Aid, AidType } from '@island.is/financial-aid/shared/lib'

@Table({
  tableName: 'aid',
  timestamps: true,
})
export class AidModel extends Model<Aid> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  @ApiProperty()
  id: string

  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  @ApiProperty()
  municipalityId: string

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  @ApiProperty()
  ownPlace: number

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  @ApiProperty()
  registeredRenting: number

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  @ApiProperty()
  unregisteredRenting: number

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  @ApiProperty()
  livesWithParents: number

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  @ApiProperty()
  unknown: number

  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: Object.values(AidType),
  })
  @ApiProperty({ enum: AidType })
  type: AidType

  @CreatedAt
  @ApiProperty()
  created: Date

  @UpdatedAt
  @ApiProperty()
  modified: Date
}
