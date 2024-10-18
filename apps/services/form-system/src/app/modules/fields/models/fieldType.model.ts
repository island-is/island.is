import { CreationOptional, NonAttribute } from 'sequelize'
import {
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'
import { LanguageType } from '../../../dataTypes/languageType.model'
import { Organization } from '../../organizations/models/organization.model'
import { Field } from './field.model'

@Table({ tableName: 'field_type' })
export class FieldType extends Model<FieldType> {
  @Column({
    type: DataType.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  type!: string

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

  @CreatedAt
  created!: CreationOptional<Date>

  @UpdatedAt
  modified!: CreationOptional<Date>

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isCommon!: boolean

  @HasMany(() => Field)
  fields?: Field[]

  @BelongsToMany(() => Organization, {
    through: 'organization_field_type',
    foreignKey: 'field_type_id',
    otherKey: 'organization_id',
  })
  organizations?: NonAttribute<Organization[]>
}
