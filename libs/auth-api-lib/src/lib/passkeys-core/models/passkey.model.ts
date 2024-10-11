import {
  Column,
  CreatedAt,
  DataType,
  Table,
  UpdatedAt,
  PrimaryKey,
  Model,
} from 'sequelize-typescript'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize'

@Table({
  tableName: 'passkey',
  indexes: [
    {
      unique: true,
      fields: ['user_sub', 'type'],
    },
  ],
})
export class PasskeyModel extends Model<
  InferAttributes<PasskeyModel>,
  InferCreationAttributes<PasskeyModel>
> {
  @PrimaryKey
  @Column({
    type: DataType.STRING,
    primaryKey: true,
    allowNull: false,
  })
  @ApiProperty()
  passkey_id!: string

  @Column({
    type: DataType.BLOB,
    allowNull: false,
  })
  @ApiProperty()
  public_key!: Uint8Array

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  user_sub!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  type!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  audkenni_sim_number!: string

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
  idp!: string

  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    get() {
      const rawValue = this.getDataValue('counter')

      // Be explicit about the return type since BIGINT can be handled as a string
      return Number(rawValue)
    },
  })
  @ApiProperty()
  counter!: number

  @CreatedAt
  @ApiProperty()
  readonly created!: CreationOptional<Date>

  @UpdatedAt
  @ApiPropertyOptional()
  readonly modified?: Date
}
