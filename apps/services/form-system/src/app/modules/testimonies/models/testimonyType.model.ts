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
import { TestimonyTypes } from '../../../enums/testimonyTypes'
import { Organization } from '../../organizations/models/organization.model'
import { Form } from '../../forms/models/form.model'

@Table({ tableName: 'testimony_types' })
export class TestimonyType extends Model<TestimonyType> {
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
    type: DataTypes.ENUM,
    allowNull: false,
    values: Object.values(TestimonyTypes),
  })
  @ApiProperty({ enum: TestimonyTypes })
  type!: string

  @CreatedAt
  @ApiProperty({ type: Date })
  created!: CreationOptional<Date>

  @UpdatedAt
  @ApiProperty({ type: Date })
  modified!: CreationOptional<Date>

  @BelongsToMany(() => Organization, {
    through: 'organization_testimony_types',
    foreignKey: 'testimony_type_id',
    otherKey: 'organization_id',
  })
  organizations?: NonAttribute<Organization[]>

  @BelongsToMany(() => Form, {
    through: 'form_testimony_types',
    foreignKey: 'testimony_type_id',
    otherKey: 'form_id',
  })
  forms?: NonAttribute<Form[]>
}
