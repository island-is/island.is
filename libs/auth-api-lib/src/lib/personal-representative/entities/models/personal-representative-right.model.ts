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
import { PersonalRepresentativeRightTypeDTO } from '../dto/personal-representative-right-type.dto'

@Table({
  tableName: 'personal_representative_right',
})
export class PersonalRepresentativeRight extends Model<PersonalRepresentativeRight> {
  @PrimaryKey
  @Column({
    type: DataType.STRING,
    primaryKey: true,
    allowNull: false,
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
    type: DataType.STRING,
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
    type: () => [PersonalRepresentative],
    required: true,
  })
  @BelongsTo(() => PersonalRepresentative)
  personalRepresentative?: unknown

  @ApiProperty({
    type: () => [PersonalRepresentativeRightType],
    required: true,
  })
  @BelongsTo(() => PersonalRepresentativeRightType)
  rightType?: unknown
}
