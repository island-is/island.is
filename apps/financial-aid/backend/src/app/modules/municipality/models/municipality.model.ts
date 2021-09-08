import {
  Column,
  CreatedAt,
  DataType,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'

import { ApiProperty } from '@nestjs/swagger'

import { Municipality } from '@island.is/financial-aid/shared/lib'

import type { MunicipalitySettings } from '@island.is/financial-aid/shared/lib'

// @Table({
//   tableName: 'municipality',
//   timestamps: true,
// })

@Table

//TODO
export class MunicipalityModel extends Model<Municipality> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  @ApiProperty()
  id: string

  // @CreatedAt
  // @ApiProperty()
  // created: Date

  // @UpdatedAt
  // @ApiProperty()
  // modified: Date

  // @Column({
  //   type: DataType.STRING,
  //   allowNull: false,
  // })
  @ApiProperty()
  name: string

  @ApiProperty()
  settings: MunicipalitySettings

  // @Column({
  //   type: DataType.ENUM,
  //   allowNull: false,
  // })
  // @ApiProperty()
  // settings: object
}
