import {
  Column,
  DataType,
  CreatedAt,
  UpdatedAt,
  Model,
  Table,
  PrimaryKey,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript'
import { ApiProperty } from '@nestjs/swagger'
import { PersonalRepresentative } from './personal-representative.model'
import { PersonalRepresentativeRightType } from './personal-representative-right-type.model'

@Table({
  tableName: 'personal_representative_right',
})
export class PersonalRepresentativeRight extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  id!: string

  @CreatedAt
  @ApiProperty()
  readonly created!: Date

  @UpdatedAt
  @ApiProperty()
  readonly modified?: Date

  @ForeignKey(() => PersonalRepresentative)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @ApiProperty()
  personalRepresentativeId!: string

  @ForeignKey(() => PersonalRepresentativeRightType)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  rightTypeCode!: string

  @ApiProperty({
    type: () => PersonalRepresentative,
    required: true,
  })
  @BelongsTo(() => PersonalRepresentative)
  personalRepresentative?: unknown

  @ApiProperty({
    type: () => PersonalRepresentativeRightType,
    required: true,
  })
  @BelongsTo(() => PersonalRepresentativeRightType)
  rightType?: unknown
}
