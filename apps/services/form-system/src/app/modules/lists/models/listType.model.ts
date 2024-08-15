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
import { ListTypes } from '../../../enums/listTypes'
import { Organization } from '../../organizations/models/organization.model'

@Table({ tableName: 'list_type' })
export class ListType extends Model<ListType> {
  @Column({
    type: DataType.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id!: string

  @Column({
    type: DataType.JSON,
    allowNull: false,
    defaultValue: () => new LanguageType(),
  })
  name!: LanguageType

  @Column({
    type: DataType.JSON,
    allowNull: false,
    defaultValue: () => new LanguageType(),
  })
  description!: LanguageType

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isCommon!: boolean

  @CreatedAt
  created!: CreationOptional<Date>

  @UpdatedAt
  modified!: CreationOptional<Date>

  @Column({
    type: DataTypes.ENUM,
    allowNull: false,
    values: Object.values(ListTypes),
  })
  type!: string

  @BelongsToMany(() => Organization, {
    through: 'organization_list_type',
    foreignKey: 'list_type_id',
    otherKey: 'organization_id',
  })
  organizations?: NonAttribute<Organization[]>
}
