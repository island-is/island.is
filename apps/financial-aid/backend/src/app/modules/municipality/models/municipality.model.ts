import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'

import { ApiProperty } from '@nestjs/swagger'

import { Municipality } from '@island.is/financial-aid/shared/lib'

import { AidModel } from '../../aid/models'
@Table({
  tableName: 'municipality',
  timestamps: true,
})
export class MunicipalityModel extends Model<Municipality> {
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
    unique: true,
  })
  @ApiProperty()
  municipalityId: string

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  @ApiProperty()
  active: boolean

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  homepage?: string

  @ForeignKey(() => AidModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @ApiProperty()
  individualAidId: string

  @BelongsTo(() => AidModel, 'individualAidId')
  @ApiProperty({ type: AidModel })
  individualAid: AidModel

  @ForeignKey(() => AidModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @ApiProperty()
  cohabitationAidId: string

  @BelongsTo(() => AidModel, 'cohabitationAidId')
  @ApiProperty({ type: AidModel })
  cohabitationAid: AidModel

  @CreatedAt
  @ApiProperty()
  created: Date

  @UpdatedAt
  @ApiProperty()
  modified: Date

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  email?: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  rulesHomepage?: string
}
