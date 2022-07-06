import { ApiProperty } from '@nestjs/swagger'
import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'
import { ApiScope } from '../../../entities/models/api-scope.model'
import { PersonalRepresentativeRightType } from './personal-representative-right-type.model'

@Table({
  tableName: 'personal_representative_scope_permission',
  indexes: [
    {
      unique: true,
      fields: ['right_type_code', 'api_scope_name'],
    },
  ],
})
export class PersonalRepresentativeScopePermission extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  id!: string

  @ForeignKey(() => PersonalRepresentativeRightType)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  rightTypeCode!: string

  @ForeignKey(() => ApiScope)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  apiScopeName!: string

  @CreatedAt
  @ApiProperty()
  readonly created!: Date

  @UpdatedAt
  @ApiProperty()
  readonly modified?: Date

  @BelongsTo(() => PersonalRepresentativeRightType)
  rightType!: PersonalRepresentativeRightType
}
