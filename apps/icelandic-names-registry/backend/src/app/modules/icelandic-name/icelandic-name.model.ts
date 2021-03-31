import {
  Column,
  CreatedAt,
  DataType,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'

import {
  IcelandicName as TIcelandicName,
  EnumNameType,
  EnumStatusType,
  NameType,
  StatusType,
} from '../../../../types'
import { ApiProperty } from '@nestjs/swagger'
import { IsEnum } from 'class-validator'

@Table({
  tableName: 'icelandic_names',
  timestamps: true,
})
export class IcelandicName
  extends Model<IcelandicName>
  implements TIcelandicName {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  @ApiProperty()
  id!: number

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  icelandic_name!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @IsEnum(EnumNameType)
  @ApiProperty()
  type!: NameType

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @IsEnum(EnumStatusType)
  @ApiProperty()
  status!: StatusType

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  description!: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  verdict!: string

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  @ApiProperty()
  visible!: boolean

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  url!: string

  @Column({
    allowNull: true,
  })
  @CreatedAt
  readonly created!: Date

  @Column({
    allowNull: true,
  })
  @UpdatedAt
  readonly modified!: Date
}

export default IcelandicName
