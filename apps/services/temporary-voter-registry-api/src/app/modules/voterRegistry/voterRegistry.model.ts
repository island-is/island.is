import {
  Column,
  CreatedAt,
  DataType,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'
import { Exclude } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

@Table({
  tableName: 'voter_registry',
  indexes: [
    {
      fields: ['national_id'],
    },
  ],
})
export class VoterRegistry extends Model {
  @ApiProperty()
  @Column({
    primaryKey: true,
    autoIncrement: true,
    defaultValue: DataType.INTEGER,
  })
  id!: string

  @ApiProperty()
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  nationalId!: string

  @ApiProperty()
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  regionNumber!: number

  @ApiProperty()
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  regionName!: string

  @Exclude()
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  version!: number

  @Exclude()
  @CreatedAt
  readonly created!: Date

  @Exclude()
  @UpdatedAt
  readonly modified!: Date
}
