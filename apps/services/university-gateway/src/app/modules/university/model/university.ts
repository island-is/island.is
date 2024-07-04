import { ApiHideProperty, ApiProperty } from '@nestjs/swagger'
import {
  Column,
  CreatedAt,
  DataType,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'
import { Program } from '../../program/model/program'
import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize'

@Table({
  tableName: 'university',
})
export class University extends Model<
  InferAttributes<University>,
  InferCreationAttributes<University>
> {
  @ApiProperty({
    description: 'University ID',
    example: '00000000-0000-0000-0000-000000000000',
    type: String,
  })
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  id!: CreationOptional<string>

  @ApiProperty({
    description: 'University national ID',
    example: '123456-7890',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  nationalId!: string

  @ApiProperty({
    description: 'Contentful key for university',
    example: 'UniversityOfIceland',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  contentfulKey!: string

  @ApiHideProperty()
  @HasMany(() => Program)
  programs?: Program[]

  @ApiHideProperty()
  @CreatedAt
  readonly created!: CreationOptional<Date>

  @ApiHideProperty()
  @UpdatedAt
  readonly modified!: CreationOptional<Date>
}
