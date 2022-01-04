import {
  Column,
  DataType,
  CreatedAt,
  UpdatedAt,
  Model,
  Table,
  PrimaryKey,
  ForeignKey,
} from 'sequelize-typescript'
import { ApiProperty } from '@nestjs/swagger'
import { PersonalRepresentativeRightType } from './personal-representative-right-type.model'
import { ApiScope } from './api-scope.model'

@Table({
  tableName: 'personal_representative_scope_permission',
  indexes: [
    {
      unique: true,
      fields: ['rightTypeCode', 'apiScopeName'],
    },
  ],
})
export class PersonalRepresentativeScopePermission extends Model<PersonalRepresentativeScopePermission> {
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
}
