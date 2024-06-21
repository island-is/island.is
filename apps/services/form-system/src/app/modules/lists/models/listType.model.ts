import { ApiProperty } from '@nestjs/swagger'
import {
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'
import { LanguageType } from '../../../dataTypes/languageType.model'
import { CreationOptional, DataTypes, NonAttribute } from 'sequelize'
import { ListTypes } from './listTypes'
import { Organization } from '../../organizations/models/organization.model'

@Table({ tableName: 'list_types' })
export class ListType extends Model<ListType> {
  @Column({
    type: DataType.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  @ApiProperty()
  id!: string

  @Column({
    type: DataType.JSON,
    allowNull: false,
    defaultValue: () => new LanguageType(),
  })
  @ApiProperty()
  name!: LanguageType

  @Column({
    type: DataType.JSON,
    allowNull: false,
    defaultValue: () => new LanguageType(),
  })
  @ApiProperty()
  description!: LanguageType

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  @ApiProperty()
  isCommon!: boolean

  @CreatedAt
  @ApiProperty({ type: Date })
  created!: CreationOptional<Date>

  @UpdatedAt
  @ApiProperty({ type: Date })
  modified!: CreationOptional<Date>

  @Column({
    type: DataTypes.ENUM,
    allowNull: false,
    values: Object.values(ListTypes),
  })
  @ApiProperty({ enum: ListTypes })
  type!: string

  @BelongsToMany(() => Organization, {
    through: 'organization_list_types',
    foreignKey: 'list_type_id',
    otherKey: 'organization_id',
  })
  organizations?: NonAttribute<Organization[]>
}
